export interface Profile {
  id: string;
  phone_number: string;
  full_name: string | null;
  default_address_id: string | null;
  loyalty_balance: number;
  is_admin: boolean;
}

export interface Address {
  id: string;
  profile_id: string;
  label: string | null;
  full_address: string;
  neighborhood: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
}

export interface Market {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rating: number;
  rating_count: number;
  address: string;
  neighborhood: string;
  city: string;
  latitude: number;
  longitude: number;
  hero_image_url: string | null;
  is_active: boolean;
  // Computed distance for UI
  distanceMeters?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  image_url: string | null;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  unit: string;
  description: string | null;
  image_url: string | null;
  is_seasonal: boolean;
  season_start_month: number | null;
  season_end_month: number | null;
  is_active: boolean;
  is_bundle: boolean;
  bundle_size_kg: number | null;
  // Joined fields
  current_price?: number;
  market_id?: string;
}

export interface Order {
  id: string;
  profile_id: string;
  market_id: string;
  address_id: string;
  status: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  delivery_type: 'single' | 'subscription';
  scheduled_date: string | null;
  subtotal_amount: number;
  delivery_fee: number;
  total_amount: number;
  loyalty_earned: number;
  loyalty_spent: number;
  payment_status: string;
  created_at: string;
  // Joined fields for UI
  items?: OrderItem[];
  etaMinutes?: number; // Mock for tracking
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  unit: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  // Joined
  product?: Product;
}

export interface Subscription {
  id: string;
  profile_id: string;
  name: string;
  market_id: string;
  status: 'active' | 'paused' | 'cancelled';
  weekly_quantity_kg: number | null;
  monthly_price: number;
  next_delivery_date: string;
}

export type CartItemType = "product" | "bundle";

export interface CartItem {
  id: string;          // unique cart item id (local)
  refId: string;       // productId
  type: CartItemType;
  nameTR: string;
  unitTR?: string;
  priceTL: number;
  quantity: number;
  isSubscription?: boolean;
  imageUrl?: string;
}

export interface LoyaltyTransaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  priority: number;
}

export interface ContentBlock {
  id: string;
  key: string;
  title: string;
  body: string;
  updated_at: string;
}
