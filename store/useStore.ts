import { create } from 'zustand';
import { Profile, Market, Address, Product } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import * as Location from 'expo-location';

interface AppState {
  user: Profile | null;
  addresses: Address[];
  nearbyMarkets: Market[];
  savedItems: Product[]; // Keeping for UI compatibility, though could be fetched
  
  // Actions
  login: (phone: string, name?: string) => Promise<void>;
  logout: () => void;
  fetchMarkets: () => Promise<void>;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Partial<Address>) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  addresses: [],
  nearbyMarkets: [],
  savedItems: [],

  login: async (phone, name) => {
    try {
      // 1. Check if profile exists
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', phone)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Login check error:', error);
        return;
      }

      // 2. Create if not exists
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            phone_number: phone, 
            full_name: name || 'Yeni Kullanıcı',
            loyalty_balance: 15 // Welcome bonus
          }])
          .select()
          .single();
        
        if (createError) {
          console.error('Create profile error:', createError);
          return;
        }
        profile = newProfile;
      }

      set({ user: profile });
      await get().fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  },

  logout: () => set({ user: null, addresses: [] }),

  fetchMarkets: async () => {
    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Fetch markets error:', error);
      return;
    }

    // Calculate mock distance for demo purposes (relative to a fixed point in Mersin)
    // In a real app, use user location
    const userLat = 36.76;
    const userLon = 34.53;

    const marketsWithDistance = data.map((m: any) => {
      const dist = getDistanceFromLatLonInKm(userLat, userLon, m.latitude, m.longitude);
      return { ...m, distanceMeters: Math.round(dist * 1000) };
    });

    set({ nearbyMarkets: marketsWithDistance });
  },

  fetchAddresses: async () => {
    const { user } = get();
    if (!user) return;

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('profile_id', user.id);

    if (error) {
      console.error('Fetch addresses error:', error);
      return;
    }

    set({ addresses: data || [] });
  },

  addAddress: async (addressData) => {
    const { user } = get();
    if (!user) return;

    const { error } = await supabase
      .from('addresses')
      .insert([{ ...addressData, profile_id: user.id }]);

    if (error) {
      console.error('Add address error:', error);
      throw error;
    }

    await get().fetchAddresses();
  }
}));

// Helper for distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}
