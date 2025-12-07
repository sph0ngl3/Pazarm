import { create } from 'zustand';

interface LoyaltyState {
  points: number;
  
  // Actions
  addPoints: (amount: number) => void;
  redeemPoints: (amount: number) => void;
}

export const useLoyaltyStore = create<LoyaltyState>((set) => ({
  points: 15, // Starting balance for demo

  // Add 1 point for every 100 TL spent (floored)
  addPoints: (amount) => set((state) => ({ 
    points: state.points + Math.floor(amount) 
  })),

  redeemPoints: (amount) => set((state) => ({ 
    points: Math.max(0, state.points - amount) 
  })),
}));
