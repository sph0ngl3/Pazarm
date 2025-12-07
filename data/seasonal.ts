import { Product } from '@/types';
import { PRODUCTS, CATEGORIES } from './sampleData';

export interface SeasonalItem {
  id: string;
  nameTR: string;
  categoryNameTR: string;
  imageUrl: string;
  type: 'MEYVE' | 'SEBZE';
  monthRange: string;
  benefits: string[];
  tips: string[];
  matchedProduct?: Product; 
  categoryId?: string;
  // New fields for out-of-stock items
  restockDate?: string;
  priceRange?: string;
  growthMonths?: string;
}

// Curated list for "This Season" - Cleaned up duplicates
const CURATED_SEASONAL_ITEMS = [
  { name: "Portakal", type: 'MEYVE' },
  { name: "Ispanak", type: 'SEBZE' },
  { name: "Karnabahar", type: 'SEBZE' },
  // Enginar intentionally has no product match to demonstrate the modal
  { name: "Enginar", type: 'SEBZE', isOutOfStock: true }, 
];

export const getSeasonalItems = (): SeasonalItem[] => {
  return CURATED_SEASONAL_ITEMS.map((item, index) => {
    // Try to find exact match or partial match in PRODUCTS
    const matchedProduct = PRODUCTS.find(p => p.nameTR.toLowerCase().includes(item.name.toLowerCase()));
    
    let categoryNameTR = item.type === 'MEYVE' ? "Meyve" : "Sebze";
    let imageUrl = "";
    let categoryId = item.type === 'MEYVE' ? "c2" : "c1";

    if (matchedProduct && !item.isOutOfStock) {
      const cat = CATEGORIES.find(c => c.id === matchedProduct.categoryId);
      categoryNameTR = cat?.nameTR || categoryNameTR;
      imageUrl = matchedProduct.imageUrl;
      categoryId = matchedProduct.categoryId;
    } else {
      // Fallback images if product not found in DB
      if (item.name === "Havuç") imageUrl = "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=200";
      else if (item.name === "Karnabahar") imageUrl = "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&q=80&w=200";
      else if (item.name === "Ispanak") imageUrl = "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200";
      else if (item.name === "Enginar") imageUrl = "https://images.unsplash.com/photo-1616801538766-074472657d23?auto=format&fit=crop&q=80&w=200";
      else imageUrl = "https://via.placeholder.com/150";
    }

    return {
      id: `seasonal_${index}`,
      nameTR: item.name,
      categoryNameTR,
      imageUrl,
      type: item.type as 'MEYVE' | 'SEBZE',
      monthRange: "Bu Ay",
      benefits: [
        "Bağışıklık sistemini güçlendirir.",
        "Yüksek vitamin ve mineral kaynağıdır.",
        "Sindirim sistemini düzenler."
      ],
      tips: [
        "Parlak ve canlı renkli olanları seçin.",
        "Serin ve kuru yerde muhafaza edin."
      ],
      matchedProduct: item.isOutOfStock ? undefined : matchedProduct,
      categoryId,
      // Mock data for out of stock / seasonal info
      restockDate: "15 Kasım",
      priceRange: "25 - 35 TL/Adet",
      growthMonths: "Mart – Mayıs"
    };
  });
};
