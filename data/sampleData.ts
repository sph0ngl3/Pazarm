import { MarketLocation, Product, ProductCategory, OrderBundle, Subscription } from '@/types';

export const MARKETS: MarketLocation[] = [
  {
    id: 'm1',
    nameTR: 'Pazarım Viranşehir Mah.',
    descriptionTR: 'Mahallenin en taze meyve ve sebzeleri burada.',
    rating: 4.9,
    reviewCount: 349,
    distanceMeters: 250,
    coordinates: { latitude: 36.7667, longitude: 34.5333 },
    isOpen: true,
    hours: { weekdays: '08:00 - 20:00', weekends: '09:00 - 21:00' },
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=800',
    address: 'Viranşehir Mah. 34320 Sk. No:4 Mezitli/Mersin'
  },
  {
    id: 'm2',
    nameTR: 'Pazarım Pozcu Merkez',
    descriptionTR: 'Geniş ürün yelpazesi ve organik seçenekler.',
    rating: 4.7,
    reviewCount: 128,
    distanceMeters: 1200,
    coordinates: { latitude: 36.7800, longitude: 34.5500 },
    isOpen: true,
    hours: { weekdays: '08:00 - 20:00', weekends: '09:00 - 21:00' },
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    address: 'Güvenevler Mah. 1919 Sk. No:12 Yenişehir/Mersin'
  },
  {
    id: 'm3',
    nameTR: 'Mezitli Köy Pazarı',
    descriptionTR: 'Doğal köy ürünleri toplama noktası.',
    rating: 4.8,
    reviewCount: 95,
    distanceMeters: 2100,
    coordinates: { latitude: 36.7500, longitude: 34.5200 },
    isOpen: true,
    hours: { weekdays: '07:00 - 19:00', weekends: '07:00 - 20:00' },
    // Authentic village market feel
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800',
    address: 'Eski Mezitli Yolu Üzeri No:45 Mezitli/Mersin'
  },
];

export const CATEGORIES: ProductCategory[] = [
  { id: 'c1', nameTR: 'Sebze & Yeşillik', type: 'daily', imageUrl: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=400' },
  { id: 'c2', nameTR: 'Meyve', type: 'daily', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=400' },
  { id: 'c4', nameTR: 'Köy Ürünleri', type: 'daily', imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400' },
  { id: 'c7', nameTR: 'Süt Ürünleri', type: 'daily', imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=400' },
  { id: 'c6', nameTR: 'Yumurta', type: 'daily', imageUrl: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&q=80&w=400' },
  { id: 'c11', nameTR: 'Mantı & Hazır Yemek', type: 'daily', imageUrl: 'https://images.unsplash.com/photo-1644364935907-84f934f5926c?auto=format&fit=crop&q=80&w=400' },
];

export const PRODUCTS: Product[] = [
  // C1: Sebze & Yeşillik
  { id: 'p1', nameTR: 'Salkım Domates', descriptionTR: 'Yerli üretim, kokulu salkım domates.', categoryId: 'c1', priceTL: 35.50, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400', marketId: 'm1' },
  { id: 'p2', nameTR: 'Çengelköy Salatalık', descriptionTR: 'Çıtır çıtır taze salatalık.', categoryId: 'c1', priceTL: 28.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&q=80&w=400', marketId: 'm1' },
  { id: 'p3', nameTR: 'Kıvırcık Marul', descriptionTR: 'Taptaze yeşil kıvırcık.', categoryId: 'c1', priceTL: 15.00, unitTR: 'Adet', imageUrl: 'https://images.unsplash.com/photo-1626078436899-7a3389e67c51?auto=format&fit=crop&q=80&w=400', marketId: 'm1' },
  { id: 'p16', nameTR: 'Kırmızı Biber', descriptionTR: 'Etli ve tatlı kırmızı kapya biber.', categoryId: 'c1', priceTL: 45.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdf5ec2e97?auto=format&fit=crop&q=80&w=400', marketId: 'm1' },
  { id: 'p17', nameTR: 'Patlıcan', descriptionTR: 'Kemer patlıcanı, közlemelik.', categoryId: 'c1', priceTL: 22.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=400', marketId: 'm1' },
  { id: 'p18', nameTR: 'Havuç', descriptionTR: 'Taze, topraklı yerli havuç.', categoryId: 'c1', priceTL: 18.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400', marketId: 'm2' },

  // C2: Meyve
  { id: 'p4', nameTR: 'Amasya Elması', descriptionTR: 'Sulu ve tatlı kırmızı elma.', categoryId: 'c2', priceTL: 40.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400', marketId: 'm1' },
  { id: 'p5', nameTR: 'Finike Portakal', descriptionTR: 'Sıkmalık ve yemelik sulu portakal.', categoryId: 'c2', priceTL: 25.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=400', marketId: 'm2' },
  { id: 'p19', nameTR: 'Muz (Yerli)', descriptionTR: 'Anamur muzu, tatlı ve aromatik.', categoryId: 'c2', priceTL: 48.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=400', marketId: 'm2' },
  { id: 'p20', nameTR: 'Armut', descriptionTR: 'Deveci armudu, sulu ve sert.', categoryId: 'c2', priceTL: 38.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1615485925694-a69ea5bd9950?auto=format&fit=crop&q=80&w=400', marketId: 'm1' },

  // C6: Yumurta
  { id: 'p6', nameTR: 'Köy Yumurtası (30\'lu)', descriptionTR: 'Gezen tavuk yumurtası, günlük taze.', categoryId: 'c6', priceTL: 120.00, unitTR: 'Koli', imageUrl: 'https://images.unsplash.com/photo-1511205748805-4e3374355291?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },
  { id: 'p21', nameTR: 'Organik Yumurta (15\'li)', descriptionTR: 'Sertifikalı organik yumurta.', categoryId: 'c6', priceTL: 75.00, unitTR: 'Koli', imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },
  
  // C7: Süt Ürünleri
  { id: 'p8', nameTR: 'Ezine Peyniri', descriptionTR: 'Tam yağlı koyun peyniri, olgunlaştırılmış.', categoryId: 'c7', priceTL: 180.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1486297678749-171b36f49e38?auto=format&fit=crop&q=80&w=400', marketId: 'm2' },
  { id: 'p12', nameTR: 'Taze Süt', descriptionTR: 'Günlük çiftlik sütü, kaynatılmamış.', categoryId: 'c7', priceTL: 45.00, unitTR: 'LT', imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },
  { id: 'p22', nameTR: 'Köy Tereyağı', descriptionTR: 'Yayık tereyağı, tuzsuz.', categoryId: 'c7', priceTL: 250.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },
  { id: 'p23', nameTR: 'Süzme Yoğurt', descriptionTR: 'Ev yapımı tadında, koyu kıvamlı.', categoryId: 'c7', priceTL: 85.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1562114808-b4b33cf60f4f?auto=format&fit=crop&q=80&w=400', marketId: 'm2' },

  // C4: Köy Ürünleri
  { id: 'p9', nameTR: 'Ev Yapımı Salça', descriptionTR: 'Güneşte kurutulmuş domates salçası.', categoryId: 'c4', priceTL: 150.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },
  { id: 'p10', nameTR: 'Kuru Fasulye', descriptionTR: 'İspir fasulyesi, çabuk pişer.', categoryId: 'c4', priceTL: 85.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },
  { id: 'p13', nameTR: 'Siyah Zeytin', descriptionTR: 'Gemlik sele zeytini, az tuzlu.', categoryId: 'c4', priceTL: 140.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1594977903823-7649d26615b8?auto=format&fit=crop&q=80&w=400', marketId: 'm2' },
  { id: 'p24', nameTR: 'Nar Ekşisi', descriptionTR: 'Doğal, katkısız ev yapımı nar ekşisi.', categoryId: 'c4', priceTL: 90.00, unitTR: '500 ML', imageUrl: 'https://images.unsplash.com/photo-1596450536788-b52e69c92747?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },

  // C11: Mantı & Hazır Yemek
  { id: 'p25', nameTR: 'Ev Mantısı', descriptionTR: 'El açması, dana kıymalı Kayseri mantısı.', categoryId: 'c11', priceTL: 180.00, unitTR: 'KG', imageUrl: 'https://images.unsplash.com/photo-1644364935907-84f934f5926c?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },
  { id: 'p26', nameTR: 'İçli Köfte (5\'li)', descriptionTR: 'Haşlamalık veya kızartmalık, cevizli.', categoryId: 'c11', priceTL: 125.00, unitTR: 'Paket', imageUrl: 'https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },
  { id: 'p27', nameTR: 'Sarma (Yaprak)', descriptionTR: 'Zeytinyağlı ev yapımı yaprak sarma.', categoryId: 'c11', priceTL: 160.00, unitTR: '500 GR', imageUrl: 'https://images.unsplash.com/photo-1603083556786-160136302633?auto=format&fit=crop&q=80&w=400', marketId: 'm3' },
];

export const BUNDLES: OrderBundle[] = [
  { 
    id: 'b1', 
    titleTR: 'Tek Kişilik M – 10KG', 
    descriptionTR: 'Haftalık temel ihtiyaçlarınız için ideal paket.', 
    bundleSizeKg: 10, 
    priceTL: 350, 
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=400',
    includedProducts: [
      { productId: 'p1', amountTR: '2 KG' },
      { productId: 'p2', amountTR: '1 KG' },
      { productId: 'p4', amountTR: '2 KG' },
      { productId: 'p5', amountTR: '2 KG' },
      { productId: 'p3', amountTR: '2 Adet' },
    ]
  },
  { 
    id: 'b2', 
    titleTR: '4–5 Kişilik Aile – 20KG', 
    descriptionTR: 'Geniş aileler için bereketli pazar seti.', 
    bundleSizeKg: 20, 
    priceTL: 650, 
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
    includedProducts: [
      { productId: 'p1', amountTR: '4 KG' },
      { productId: 'p2', amountTR: '3 KG' },
      { productId: 'p3', amountTR: '2 Adet' },
      { productId: 'p4', amountTR: '4 KG' },
      { productId: 'p5', amountTR: '4 KG' },
      { productId: 'p6', amountTR: '1 Koli' },
    ]
  },
  { 
    id: 'b3', 
    titleTR: '7–9 Kişilik Mutfak – 40KG', 
    descriptionTR: 'Kalabalık sofralar ve büyük mutfaklar için.', 
    bundleSizeKg: 40, 
    priceTL: 1200, 
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&q=80&w=400',
    includedProducts: [
      { productId: 'p1', amountTR: '8 KG' },
      { productId: 'p2', amountTR: '5 KG' },
      { productId: 'p3', amountTR: '4 Adet' },
      { productId: 'p4', amountTR: '8 KG' },
      { productId: 'p5', amountTR: '8 KG' },
      { productId: 'p6', amountTR: '2 Koli' },
    ]
  },
];

export const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 's1',
    bundleNameTR: '4–5 Kişilik Aile – 20KG',
    nextDeliveryDate: '26 Ekim 2025 Pazar',
    monthlyPriceTL: 2340, // 650 * 0.9 * 4
    status: 'active'
  }
];
