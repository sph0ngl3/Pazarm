import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { PRODUCTS } from '@/data/sampleData';
import { useCartStore } from '@/store/useCartStore';
import { Card } from '@/components/ui/Card';
import { PazarmHeader } from '@/components/PazarmHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductListScreen() {
  const { categoryId, categoryTitleTR } = useLocalSearchParams<{ categoryId: string, categoryTitleTR: string }>();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const insets = useSafeAreaInsets();

  const products = PRODUCTS.filter(p => p.categoryId === categoryId);

  const handleAddToCart = (item: any) => {
    addItem({
      refId: item.id,
      type: 'product',
      nameTR: item.nameTR,
      unitTR: item.unitTR,
      priceTL: item.priceTL,
      quantity: 1,
      imageUrl: item.imageUrl
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
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.nameTR}</Text>
                <Text style={styles.unit}>{item.unitTR}</Text>
                <Text style={styles.price}>{item.priceTL.toFixed(2)} TL</Text>
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
