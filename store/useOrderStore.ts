import { create } from 'zustand';
import { CartItem } from '@/types';

export type OrderStatus = 'idle' | 'active' | 'delivered';

export interface ActiveOrder {
  id: string;
  marketId: string;
  etaMinutes: number;
  items: CartItem[];
}

interface OrderState {
  status: OrderStatus;
  activeOrder: ActiveOrder | null;
  startOrder: (order: ActiveOrder) => void;
  completeOrder: () => void;
  resetOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  status: 'idle',
  activeOrder: null,

  startOrder: (order) => set({ 
    status: 'active', 
    activeOrder: order 
  }),

  completeOrder: () => set({ 
    status: 'delivered' 
  }),

  resetOrder: () => set({ 
    status: 'idle', 
    activeOrder: null 
  }),
}));
