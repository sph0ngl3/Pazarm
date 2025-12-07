import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { BUNDLES, PRODUCTS } from '@/data/sampleData';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function BundleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  const bundle = BUNDLES.find(b => b.id === id);

  if (!bundle) return null;

  const handleAddToCart = () => {
    addItem({
      refId: bundle.id,
      type: 'bundle',
      nameTR: bundle.titleTR,
      unitTR: `${bundle.bundleSizeKg} KG Set`,
      priceTL: bundle.priceTL,
      quantity: 1,
      isSubscription: false, // Default to one-time
      imageUrl: bundle.imageUrl
    });
    
    showToast("Sepete eklendi");

    // Auto navigate back to list
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
          <Image source={{ uri: bundle.imageUrl }} style={styles.image} />
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
          <View style={styles.titleRow}>
            <Text style={styles.title}>{bundle.titleTR}</Text>
            <View style={styles.ratingBadge}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{bundle.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.price}>{bundle.priceTL} TL</Text>
          <Text style={styles.description}>{bundle.descriptionTR}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Paket İçeriği</Text>
          <View style={styles.productList}>
            {bundle.includedProducts.map((item, index) => (
              <View key={index} style={styles.productItem}>
                <CheckCircle2 size={18} color={COLORS.freshGreen} />
                <Text style={styles.productText}>
                  {item.amountTR} {PRODUCTS.find(p => p.id === item.productId)?.nameTR || 'Ürün'}
                </Text>
              </View>
            ))}
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
    height: 250,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  title: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: COLORS.textPrimary,
    marginRight: SPACING.m,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.s,
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#B7791F',
  },
  price: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.freshGreen,
    marginBottom: SPACING.m,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
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
    marginBottom: SPACING.m,
  },
  productList: {
    gap: SPACING.s,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  productText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: COLORS.textPrimary,
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
