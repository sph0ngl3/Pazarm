import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { MapPin, Star } from 'lucide-react-native';
import { PazarmHeader } from '@/components/PazarmHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabaseClient';
import { Category, Product } from '@/types';

export default function ProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<Category[]>([]);
  const [bundles, setBundles] = useState<Product[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Categories
    const { data: cats } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');
    if (cats) setCategories(cats);

    // Bundles (Products marked as bundle)
    // Join market_products to get price
    const { data: bndls } = await supabase
      .from('products')
      .select('*, market_products(current_price)')
      .eq('is_bundle', true);
    
    if (bndls) {
      const formatted = bndls.map((b: any) => ({
        ...b,
        current_price: b.market_products?.[0]?.current_price || 0
      }));
      setBundles(formatted);
    }
  };

  return (
    <View style={styles.container}>
      <PazarmHeader title="Ürünler" />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}>
        {/* Categories Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <View style={styles.grid}>
            {categories.filter(c => c.slug !== 'paketler').map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => router.push(`/product/list?categoryId=${cat.id}&categoryTitleTR=${encodeURIComponent(cat.name)}`)}
                style={styles.gridItemWrapper}
              >
                <CategoryCard title={cat.name} distance="Tüm Pazarlar" imageUrl={cat.image_url || ''} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weekly Bundles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Haftalık Abonelik Paketleri</Text>
          <View style={styles.verticalList}>
            {bundles.map(bundle => (
              <TouchableOpacity 
                key={bundle.id} 
                onPress={() => router.push(`/product/${bundle.id}`)}
              >
                <BundleCard 
                  title={bundle.name} 
                  rating="4.9" 
                  imageUrl={bundle.image_url || ''} 
                  price={bundle.current_price}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const CategoryCard = ({ title, distance, imageUrl }: { title: string, distance: string, imageUrl?: string }) => (
  <Card style={styles.categoryCard}>
    <Image 
      source={{ uri: imageUrl || 'https://via.placeholder.com/400x260' }} 
      style={styles.imagePlaceholder} 
      resizeMode="cover"
    />
    <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
    <View style={styles.distanceRow}>
      <MapPin size={12} color={COLORS.textSecondary} />
      <Text style={styles.distanceText}>{distance}</Text>
    </View>
  </Card>
);

const BundleCard = ({ title, rating, imageUrl, price }: { title: string, rating: string, imageUrl?: string, price?: number }) => (
  <Card style={styles.bundleCard}>
    <Image 
      source={{ uri: imageUrl || 'https://via.placeholder.com/400x260' }} 
      style={styles.bundleImagePlaceholder} 
      resizeMode="cover"
    />
    <View style={styles.bundleInfo}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.ratingRow}>
        <Star size={12} color="#F59E0B" fill="#F59E0B" />
        <Text style={styles.ratingText}>{rating}</Text>
        <Text style={{ marginLeft: 'auto', color: COLORS.freshGreen, fontWeight: 'bold' }}>{price} TL</Text>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: SPACING.m,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginLeft: SPACING.l,
    marginBottom: SPACING.m,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
  },
  gridItemWrapper: {
    width: '47%', 
  },
  verticalList: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
  },
  categoryCard: {
    padding: 0,
    backgroundColor: COLORS.white,
    width: '100%',
  },
  imagePlaceholder: {
    height: 100,
    width: '100%',
    backgroundColor: '#E2E8F0',
    marginBottom: SPACING.s,
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
    paddingHorizontal: SPACING.s,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.s,
    paddingBottom: SPACING.s,
  },
  distanceText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bundleCard: {
    flexDirection: 'row',
    padding: SPACING.s,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    gap: SPACING.m,
  },
  bundleImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.s,
  },
  bundleInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
