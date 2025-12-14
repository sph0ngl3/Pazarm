-- File: supabase/migrations/20250213000000_admin_features.sql

-- 1. Create Campaigns Table
create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean default true,
  priority integer default 0,
  created_at timestamptz default now()
);

-- 2. Create Content Blocks Table
create table if not exists content_blocks (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null, -- 'about', 'privacy', 'terms', 'faq'
  title text not null,
  body text,
  updated_at timestamptz default now()
);

-- 3. Reset Loyalty Balance (One-time reset)
update profiles set loyalty_balance = 0;

-- 4. Enable RLS
alter table campaigns enable row level security;
create policy "Public read campaigns" on campaigns for select using (true);

alter table content_blocks enable row level security;
create policy "Public read content_blocks" on content_blocks for select using (true);

-- 5. Seed Data for Admin Features

-- Content Blocks
insert into content_blocks (key, title, body) values 
('about', 'Hakkımızda', 'PazarM, mahalle pazarını evinize taşıyan yeni nesil bir teslimat uygulamasıdır. Amacımız, taze ve doğal ürünlere ulaşımı kolaylaştırmak, yerel üreticileri desteklemek ve size zaman kazandırmaktır. \n\nMisyonumuz, tarladan sofraya en kısa yolu oluşturarak tazeliği korumaktır.'),
('privacy', 'Gizlilik Politikası', 'PazarM olarak gizliliğinize önem veriyoruz. Kişisel verileriniz KVKK kapsamında güvenle saklanmaktadır. \n\n1. Veri Toplama: Hizmetlerimizi sunmak için gerekli asgari verileri topluyoruz.\n2. Veri Kullanımı: Verileriniz sadece sipariş teslimatı ve hizmet iyileştirmesi için kullanılır.'),
('terms', 'Kullanım Koşulları', 'PazarM uygulamasını kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız:\n\n1. Siparişler teslimat saatinden en az 2 saat önce iptal edilebilir.\n2. Teslimat sırasında ürünü kontrol etme hakkınız vardır.\n3. Ödemeler güvenli altyapı ile işlenir.')
on conflict (key) do nothing;

-- Campaigns
insert into campaigns (title, description, image_url, priority, is_active) values
('Haftanın Fırsatı', 'Tüm sebze paketlerinde %20 indirim! Bu hafta sonuna özel.', 'https://images.unsplash.com/photo-1542838132-92c53300491e', 10, true),
('Taze Meyve Şöleni', 'Mevsim meyvelerinde büyük kampanya. 3 Al 2 Öde fırsatını kaçırmayın.', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf', 5, true),
('Kış Hazırlığı', 'Salçalık domates ve biberlerde toptan fiyatına perakende satış.', 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a', 8, true);
