import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface LoyaltyState {
  points: number;
  fetchPoints: (userId: string) => Promise<void>;
}

export const useLoyaltyStore = create<LoyaltyState>((set) => ({
  points: 0,

  fetchPoints: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('loyalty_balance')
      .eq('id', userId)
      .single();
    
    if (data) {
      set({ points: data.loyalty_balance });
    }
  },
}));
