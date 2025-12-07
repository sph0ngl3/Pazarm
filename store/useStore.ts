import { create } from 'zustand';
import { User, MarketLocation, Order, Address, Product, OrderBundle } from '@/types';
import { MARKETS, BUNDLES } from '@/data/sampleData';

interface AppState {
  user: User | null;
  activeOrder: Order | null;
  savedItems: (Product | OrderBundle)[];
  nearbyMarkets: MarketLocation[];
  addresses: Address[];
  cart: (Product | OrderBundle)[];
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  createOrder: (order: Order) => void;
  toggleSaved: (item: Product | OrderBundle) => void;
  addAddress: (address: Address) => void;
  addToCart: (item: Product | OrderBundle) => void;
}

// Initial Mock Addresses
const INITIAL_ADDRESSES: Address[] = [
  { id: 'a1', title: 'Ev', fullAddress: 'Viranşehir Mah. 34325.sk Mezitli apt mersin...', district: 'Mezitli', neighborhood: 'Viranşehir' },
  { id: 'a2', title: 'Ofis', fullAddress: 'Viranşehir Mah. sahil restaurant...', district: 'Mezitli', neighborhood: 'Viranşehir' },
];

export const useStore = create<AppState>((set) => ({
  user: null,
  activeOrder: null,
  savedItems: [],
  nearbyMarkets: MARKETS,
  addresses: INITIAL_ADDRESSES,
  cart: [],

  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  createOrder: (order) => set({ activeOrder: order }),
  toggleSaved: (item) => set((state) => {
    const exists = state.savedItems.find((i) => i.id === item.id);
    if (exists) {
      return { savedItems: state.savedItems.filter((i) => i.id !== item.id) };
    }
    return { savedItems: [...state.savedItems, item] };
  }),
  addAddress: (address) => set((state) => ({ addresses: [...state.addresses, address] })),
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
}));
