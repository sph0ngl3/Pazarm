import { create } from 'zustand';
import { Order, CartItem, Profile, Address } from '@/types';
import { supabase } from '@/lib/supabaseClient';

export type OrderStatus = 'idle' | 'active' | 'delivered';

interface OrderState {
  status: OrderStatus;
  activeOrder: Order | null;
  
  startOrder: (
    user: Profile, 
    marketId: string, 
    address: Address, 
    items: CartItem[], 
    totals: { subtotal: number, total: number, discount: number },
    isSubscription: boolean
  ) => Promise<string | null>; // returns order ID
  
  completeOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  status: 'idle',
  activeOrder: null,

  startOrder: async (user, marketId, address, items, totals, isSubscription) => {
    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          profile_id: user.id,
          market_id: marketId,
          address_id: address.id,
          status: 'preparing',
          delivery_type: isSubscription ? 'subscription' : 'single',
          subtotal_amount: totals.subtotal,
          total_amount: totals.total,
          loyalty_spent: totals.discount,
          loyalty_earned: Math.floor(totals.total / 100), // 1% earn
          payment_status: 'paid' // Mock payment
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.refId,
        unit: item.unitTR || 'Adet',
        quantity: item.quantity,
        unit_price: item.priceTL,
        line_total: item.priceTL * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Update Loyalty (Spend)
      if (totals.discount > 0) {
        await supabase.from('loyalty_transactions').insert({
          profile_id: user.id,
          type: 'spend',
          amount: -totals.discount,
          description: 'Sipariş indirimi',
          order_id: order.id
        });
        
        // Update profile balance
        await supabase.rpc('decrement_loyalty', { 
           row_id: user.id, 
           amount: totals.discount 
        }).catch(async () => {
             // Fallback if RPC not exists
             const { data: p } = await supabase.from('profiles').select('loyalty_balance').eq('id', user.id).single();
             if(p) {
                 await supabase.from('profiles').update({ loyalty_balance: p.loyalty_balance - totals.discount }).eq('id', user.id);
             }
        });
      }

      // 4. Update Loyalty (Earn)
      const earned = Math.floor(totals.total / 100);
      if (earned > 0) {
        await supabase.from('loyalty_transactions').insert({
            profile_id: user.id,
            type: 'earn',
            amount: earned,
            description: 'Sipariş kazancı',
            order_id: order.id
        });
        // Update profile balance (simple increment)
         const { data: p } = await supabase.from('profiles').select('loyalty_balance').eq('id', user.id).single();
         if(p) {
             await supabase.from('profiles').update({ loyalty_balance: p.loyalty_balance + earned }).eq('id', user.id);
         }
      }

      // 5. Create Subscription if needed
      if (isSubscription) {
        // Find bundle item
        const bundleItem = items.find(i => i.isSubscription);
        if (bundleItem) {
            await supabase.from('subscriptions').insert({
                profile_id: user.id,
                name: bundleItem.nameTR,
                market_id: marketId,
                status: 'active',
                monthly_price: bundleItem.priceTL * 4 * 0.9, // approx logic
                next_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
      }

      // Set active order locally for tracking UI
      set({ 
        status: 'active', 
        activeOrder: { 
            ...order, 
            items: items.map(i => ({...i, product_id: i.refId})), // Map for UI compatibility
            etaMinutes: 15 
        } 
      });

      return order.id;
    } catch (e) {
      console.error('Start order error:', e);
      return null;
    }
  },

  completeOrder: () => set({ status: 'delivered' }),
}));
