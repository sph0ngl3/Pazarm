import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, market_products(current_price)')
      .eq('id', id)
      .single();
    
    if (data) {
      setProduct({
        ...data,
        current_price: data.market_products?.[0]?.current_price || 0
      });
    }
  };

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      refId: product.id,
      type: product.is_bundle ? 'bundle' : 'product',
      nameTR: product.name,
      unitTR: product.unit,
      priceTL: product.current_price || 0,
      quantity: 1,
      imageUrl: product.image_url || ''
    });
    
    showToast(`Sepete eklendi: ${product.name}`);
    
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.navigate('/(tabs)/saved');
      }
    }, 600);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image_url || '' }} style={styles.image} />
          <SafeAreaView style={styles.header} edges={['top']}>
            <Button 
              title="" 
              icon={<ArrowLeft size={24} color={COLORS.textPrimary} />} 
              onPress={() => router.back()} 
              variant="ghost"
              style={styles.backButton}
            />
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.current_price?.toFixed(2)} TL <Text style={styles.unit}>/ {product.unit}</Text></Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>Bu ürün Pazarım noktaları tarafından hazırlanır.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Sepete Ekle" onPress={handleAddToCart} size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButton: {
    marginLeft: SPACING.s,
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.l,
    marginTop: -24,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  price: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: COLORS.freshGreen,
  },
  unit: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.l,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.l,
  },
  noteContainer: {
    backgroundColor: '#FFF8E1',
    padding: SPACING.m,
    borderRadius: RADIUS.m,
  },
  noteText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#B7791F',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
});
