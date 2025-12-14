-- Operation: Enable Row Level Security (RLS) and set default policies
-- Impact: High (Security)
-- Description: Locks down database tables. Catalog tables become Read-Only for the app. User tables remain open for the app to function until real Auth is implemented.

-- 1. Enable RLS on all public tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;

-- 2. Catalog Policies (Read-Only for App)
-- Everyone can read, but nobody (except service_role/admin) can write
CREATE POLICY "Public Read Markets" ON markets FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Market Products" ON market_products FOR SELECT USING (true);

-- 3. User Data Policies (Full Access for App Logic)
-- WARNING: These policies allow public read/write to support the current "Mock Auth" flow.
-- TODO: When Supabase Auth (OTP) is implemented, change these to: USING (auth.uid() = profile_id)
CREATE POLICY "Public Access Profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Public Access Addresses" ON addresses FOR ALL USING (true);
CREATE POLICY "Public Access Orders" ON orders FOR ALL USING (true);
CREATE POLICY "Public Access Order Items" ON order_items FOR ALL USING (true);
CREATE POLICY "Public Access Subscriptions" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Public Access Subscription Deliveries" ON subscription_deliveries FOR ALL USING (true);
CREATE POLICY "Public Access Loyalty" ON loyalty_transactions FOR ALL USING (true);
CREATE POLICY "Public Access Partnerships" ON partnerships FOR ALL USING (true);

-- 4. Admin Data (Private)
-- product_price_history is for internal use only. No policy = No public access.
