import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, Plus } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabaseClient';
import { Market, Product } from '@/types';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  
  const [market, setMarket] = useState<Market | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchMarketDetails();
    }
  }, [id]);

  const fetchMarketDetails = async () => {
    // 1. Fetch Market
    const { data: m } = await supabase.from('markets').select('*').eq('id', id).single();
    if (m) setMarket(m);

    // 2. Fetch Products available in this market
    const { data: mp } = await supabase
      .from('market_products')
      .select('current_price, product:products(*)')
      .eq('market_id', id)
      .limit(10);
    
    if (mp) {
      const formatted = mp.map((item: any) => ({
        ...item.product,
        current_price: item.current_price
      }));
      setProducts(formatted);
    }
  };

  if (!market) return null;

  const handleAddToCart = (item: any) => {
    addItem({
      refId: item.id,
      type: 'product',
      nameTR: item.name,
      unitTR: item.unit,
      priceTL: item.current_price,
      quantity: 1,
      imageUrl: item.image_url
    });
    showToast(`Sepete eklendi: ${item.name}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageHeader}>
        <Image source={{ uri: market.hero_image_url || '' }} style={styles.image} />
        <View style={styles.gradientOverlay} />
        <SafeAreaView style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft size={24} color={COLORS.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 + insets.bottom }}>
        <View style={styles.section}>
          <Text style={styles.breadcrumb}>Pazarım {'>'} {market.neighborhood}</Text>
          <Text style={styles.title}>{market.name}</Text>
          <View style={styles.ratingRow}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{market.rating} ({market.rating_count})</Text>
          </View>
        </View>

        {/* Market Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bu noktadaki ürünler</Text>
          {products.map(product => (
            <TouchableOpacity 
              key={product.id} 
              onPress={() => router.push(`/product/${product.id}`)}
            >
              <Card style={styles.productCard}>
                <Image source={{ uri: product.image_url || '' }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.current_price} TL / {product.unit}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <Plus size={16} color={COLORS.white} />
                </TouchableOpacity>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bilgi:</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{market.address}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageHeader: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.m,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginTop: -20,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.l,
  },
  section: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.l,
  },
  breadcrumb: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.m,
  },
  addressContainer: {},
  addressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.s,
    marginBottom: SPACING.s,
    backgroundColor: COLORS.white,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.s,
    backgroundColor: '#eee',
  },
  productInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  productName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  productPrice: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.freshGreen,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
