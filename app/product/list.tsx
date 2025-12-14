import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { useCartStore } from '@/store/useCartStore';
import { Card } from '@/components/ui/Card';
import { PazarmHeader } from '@/components/PazarmHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';

export default function ProductListScreen() {
  const { categoryId, categoryTitleTR } = useLocalSearchParams<{ categoryId: string, categoryTitleTR: string }>();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, market_products(current_price)')
      .eq('category_id', categoryId);
    
    if (data) {
      const formatted = data.map((p: any) => ({
        ...p,
        current_price: p.market_products?.[0]?.current_price || 0
      }));
      setProducts(formatted);
    }
  };

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
    Alert.alert('Sepete Eklendi', 'Ürün sepetinize eklendi.');
  };

  return (
    <View style={styles.container}>
      <PazarmHeader title={categoryTitleTR} showBack />

      <FlatList
        data={products}
        contentContainerStyle={[styles.list, { paddingBottom: 40 + insets.bottom }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
            <Card style={styles.productCard}>
              <Image source={{ uri: item.image_url || '' }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.unit}>{item.unit}</Text>
                <Text style={styles.price}>{item.current_price?.toFixed(2)} TL</Text>
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
              >
                <Plus size={20} color={COLORS.white} />
              </TouchableOpacity>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.m,
    gap: SPACING.m,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.s,
    backgroundColor: COLORS.white,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.m,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  unit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.freshGreen,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
