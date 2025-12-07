export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MarketLocation {
  id: string;
  nameTR: string;
  descriptionTR: string;
  rating: number;
  reviewCount: number;
  distanceMeters: number;
  coordinates: Coordinates;
  isOpen: boolean;
  hours: {
    weekdays: string;
    weekends: string;
  };
  imageUrl: string;
  address: string;
}

export interface ProductCategory {
  id: string;
  nameTR: string;
  type: 'daily' | 'weeklyBundle' | 'other';
  imageUrl?: string;
}

export interface Product {
  id: string;
  nameTR: string;
  descriptionTR: string;
  categoryId: string;
  priceTL: number;
  unitTR: string; // e.g. "1 KG", "adet"
  imageUrl: string;
  isWeeklyBundle?: boolean;
  bundleSizeKg?: number;
  marketId?: string; // Optional link to specific market
}

export interface OrderBundle {
  id: string;
  titleTR: string;
  descriptionTR: string;
  bundleSizeKg: number;
  includedProducts: { productId: string; amountTR: string }[];
  priceTL: number;
  rating: number;
  imageUrl: string;
}

export interface Address {
  id: string;
  title: string; // e.g. "Ev", "Ofis"
  fullAddress: string;
  district: string; // İlçe
  neighborhood: string; // Mahalle
  details?: string; // Kat/Daire
}

export interface Order {
  id: string;
  status: 'preparing' | 'on_the_way' | 'delivered';
  etaMinutes: number;
  items: (Product | OrderBundle)[];
  marketId: string;
  deliveryLocation: Coordinates;
}

export type CartItemType = "product" | "bundle";

export interface CartItem {
  id: string;          // unique cart item id (e.g. timestamp + random)
  refId: string;       // productId or bundleId
  type: CartItemType;  // "product" or "bundle"
  nameTR: string;
  unitTR?: string;     // e.g. "1 KG", "adet", "20KG"
  priceTL: number;
  quantity: number;
  isSubscription?: boolean; // true if monthly subscription (only for bundles)
  imageUrl?: string;
}

export interface Subscription {
  id: string;
  bundleNameTR: string;
  nextDeliveryDate: string;
  monthlyPriceTL: number;
  status: 'active' | 'paused';
}
