-- File: supabase/migrations/20250212000000_init_schema.sql - Complete file replacement needed
-- Complete schema setup and seed data

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Cleanup (Drop existing tables to ensure clean state)
drop table if exists partnerships;
drop table if exists loyalty_transactions;
drop table if exists subscription_deliveries;
drop table if exists subscriptions;
drop table if exists order_items;
drop table if exists orders;
drop table if exists product_price_history;
drop table if exists market_products;
drop table if exists products;
drop table if exists categories;
drop table if exists markets;
drop table if exists addresses;
drop table if exists profiles;

-- 3. Create Tables

-- Profiles (App-level users)
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  phone_number text unique not null,
  full_name text,
  default_address_id uuid, -- FK added later
  loyalty_balance numeric default 0,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Addresses
create table addresses (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  label text,
  full_address text,
  neighborhood text,
  city text,
  latitude numeric,
  longitude numeric,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Add circular FK for profiles -> default_address
alter table profiles add constraint fk_default_address foreign key (default_address_id) references addresses(id);

-- Markets
create table markets (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  rating numeric default 4.8,
  rating_count integer default 0,
  address text,
  neighborhood text,
  city text,
  latitude numeric,
  longitude numeric,
  hero_image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  display_order integer default 0,
  image_url text,
  created_at timestamptz default now()
);

-- Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id),
  name text not null,
  slug text unique not null,
  unit text,
  description text,
  image_url text,
  is_seasonal boolean default false,
  season_start_month integer,
  season_end_month integer,
  is_active boolean default true,
  -- Missing columns added back:
  is_bundle boolean default false,
  bundle_size_kg numeric,
  created_at timestamptz default now()
);

-- Market Products (Inventory/Price)
create table market_products (
  id uuid primary key default uuid_generate_v4(),
  market_id uuid references markets(id),
  product_id uuid references products(id),
  current_price numeric not null,
  currency text default 'TRY',
  current_stock numeric,
  is_available boolean default true,
  updated_at timestamptz default now()
);

-- Product Price History
create table product_price_history (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id),
  market_id uuid references markets(id),
  effective_date date,
  purchase_price numeric,
  sale_price numeric,
  currency text default 'TRY',
  wastage_rate numeric,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  market_id uuid references markets(id),
  address_id uuid references addresses(id),
  status text, -- 'pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'
  delivery_type text,
  scheduled_date date,
  scheduled_time_slot text,
  subtotal_amount numeric,
  delivery_fee numeric default 0,
  total_amount numeric,
  loyalty_earned numeric default 0,
  loyalty_spent numeric default 0,
  payment_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order Items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  unit text,
  quantity numeric,
  unit_price numeric,
  line_total numeric,
  cost_price numeric,
  created_at timestamptz default now()
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  name text,
  market_id uuid references markets(id),
  status text,
  weekly_quantity_kg numeric,
  monthly_price numeric,
  next_delivery_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subscription Deliveries
create table subscription_deliveries (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid references subscriptions(id),
  order_id uuid references orders(id),
  delivery_date date,
  status text,
  created_at timestamptz default now()
);

-- Loyalty Transactions
create table loyalty_transactions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  type text, -- 'earn', 'spend', 'adjust'
  amount numeric,
  description text,
  order_id uuid references orders(id),
  created_at timestamptz default now()
);

-- Partnerships
create table partnerships (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  product_id uuid references products(id),
  amount_invested numeric,
  expected_return_rate numeric,
  start_date date,
  expected_payout_date date,
  status text,
  notes text,
  created_at timestamptz default now()
);

-- 4. Seed Data

-- Insert Markets
INSERT INTO markets (name, slug, description, address, city, latitude, longitude, hero_image_url) VALUES
('Mezitli Köy Pazarı', 'mezitli-koy-pazari', 'Doğal ve taze ürünlerin adresi', 'Mezitli Merkez', 'Mersin', 36.75, 34.55, 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e'),
('Viranşehir Pazarı', 'viransehir-pazari', 'Geleneksel semt pazarı', 'Viranşehir Mah.', 'Mersin', 36.77, 34.58, 'https://images.unsplash.com/photo-1488459716781-31db52582fe9');

-- Insert Categories
INSERT INTO categories (name, slug, display_order, image_url) VALUES
('Meyve', 'meyve', 1, 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b'),
('Sebze', 'sebze', 2, 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7'),
('Yeşillik', 'yesillik', 3, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb');

-- Insert Products (Meyve)
INSERT INTO products (category_id, name, slug, unit, is_seasonal, season_start_month, season_end_month, image_url) 
SELECT id, 'Finike Portakal', 'finike-portakal', 'KG', true, 11, 4, 'https://images.unsplash.com/photo-1547514701-42782101795e' FROM categories WHERE slug = 'meyve';

INSERT INTO products (category_id, name, slug, unit, is_seasonal, season_start_month, season_end_month, image_url) 
SELECT id, 'Amasya Elması', 'amasya-elmasi', 'KG', true, 9, 3, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6' FROM categories WHERE slug = 'meyve';

-- Insert Products (Sebze)
INSERT INTO products (category_id, name, slug, unit, is_seasonal, season_start_month, season_end_month, image_url) 
SELECT id, 'Salkım Domates', 'salkim-domates', 'KG', true, 6, 10, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea' FROM categories WHERE slug = 'sebze';

INSERT INTO products (category_id, name, slug, unit, is_seasonal, season_start_month, season_end_month, image_url) 
SELECT id, 'Çengelköy Salatalık', 'cengelkoy-salatalik', 'KG', true, 5, 9, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6' FROM categories WHERE slug = 'sebze';

-- Insert Bundle Product (Required for Saved/Bundles screen)
INSERT INTO products (category_id, name, slug, unit, is_bundle, bundle_size_kg, is_active, image_url)
SELECT id, 'Tek Kişilik M – 10KG', 'tek-kisilik-m', 'Set', true, 10, true, 'https://images.unsplash.com/photo-1610348725531-843dff563e2c' FROM categories WHERE slug = 'sebze';

-- Link Products to Markets (Market Products)
INSERT INTO market_products (market_id, product_id, current_price, current_stock)
SELECT m.id, p.id, 25.50, 100
FROM markets m, products p
WHERE m.slug = 'mezitli-koy-pazari' AND p.slug = 'finike-portakal';

INSERT INTO market_products (market_id, product_id, current_price, current_stock)
SELECT m.id, p.id, 35.00, 50
FROM markets m, products p
WHERE m.slug = 'mezitli-koy-pazari' AND p.slug = 'salkim-domates';

INSERT INTO market_products (market_id, product_id, current_price, current_stock)
SELECT m.id, p.id, 15.00, 200
FROM markets m, products p
WHERE m.slug = 'viransehir-pazari' AND p.slug = 'amasya-elmasi';

INSERT INTO market_products (market_id, product_id, current_price, current_stock)
SELECT m.id, p.id, 350.00, 20
FROM markets m, products p
WHERE m.slug = 'mezitli-koy-pazari' AND p.slug = 'tek-kisilik-m';
