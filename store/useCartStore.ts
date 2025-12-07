import { create } from 'zustand';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  toggleSubscription: (id: string, isSubscription: boolean) => void;
  clearCart: () => void;
  
  // Derived
  getTotals: () => { oneTimeTotalTL: number; subscriptionTotalTL: number; grandTotalTL: number };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (newItem) => set((state) => {
    // Check if same item exists (same refId and same subscription status)
    const existingItem = state.items.find(
      i => i.refId === newItem.refId && i.isSubscription === newItem.isSubscription
    );

    if (existingItem) {
      return {
        items: state.items.map(i => 
          i.id === existingItem.id 
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        )
      };
    }

    return {
      items: [...state.items, { ...newItem, id: Date.now().toString() + Math.random() }]
    };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),

  updateItemQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) {
      return { items: state.items.filter(i => i.id !== id) };
    }
    return {
      items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
    };
  }),

  toggleSubscription: (id, isSubscription) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, isSubscription } : i)
  })),

  clearCart: () => set({ items: [] }),

  getTotals: () => {
    const { items } = get();
    let oneTimeTotalTL = 0;
    let subscriptionTotalTL = 0;

    items.forEach(item => {
      if (item.isSubscription) {
        // 4-Week Subscription Model:
        // Weekly Price = Base Price * 0.9 (10% discount)
        // Monthly Total = Weekly Price * 4
        const weeklyDiscountedPrice = item.priceTL * 0.9;
        subscriptionTotalTL += (weeklyDiscountedPrice * 4) * item.quantity;
      } else {
        oneTimeTotalTL += item.priceTL * item.quantity;
      }
    });

    return {
      oneTimeTotalTL,
      subscriptionTotalTL,
      grandTotalTL: oneTimeTotalTL + subscriptionTotalTL
    };
  }
}));
