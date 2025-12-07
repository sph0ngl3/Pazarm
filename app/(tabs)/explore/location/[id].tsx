import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, Share2, Heart, Plus } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { PRODUCTS } from '@/data/sampleData';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/components/ui/Toast';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const market = useStore((state) => state.nearbyMarkets.find(m => m.id === id));
  const createOrder = useStore((state) => state.createOrder);
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  if (!market) return null;

  // Filter products for this market (mock logic: if marketId matches or just show some random ones for demo)
  const marketProducts = PRODUCTS.filter(p => p.marketId === id || !p.marketId).slice(0, 3);

  const handleOrder = () => {
    createOrder({
      id: 'ord_' + Date.now(),
      status: 'preparing',
      etaMinutes: 9,
      items: [],
      marketId: market.id,
      deliveryLocation: { latitude: 0, longitude: 0 }
    });
    router.push('/explore/tracking');
  };

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
    showToast(`Sepete eklendi: ${item.nameTR}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageHeader}>
        <Image source={{ uri: market.imageUrl }} style={styles.image} />
        <View style={styles.gradientOverlay} />
        <SafeAreaView style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft size={24} color={COLORS.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 + insets.bottom }}>
        <View style={styles.section}>
          <Text style={styles.breadcrumb}>Pazarım {'>'} Mahallem</Text>
          <Text style={styles.title}>{market.nameTR}</Text>
          <View style={styles.ratingRow}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{market.rating} ({market.reviewCount})</Text>
          </View>
        </View>

        {/* Market Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bu noktadaki ürünler</Text>
          {marketProducts.map(product => (
            <TouchableOpacity 
              key={product.id} 
              onPress={() => router.push(`/product/${product.id}`)}
            >
              <Card style={styles.productCard}>
                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.nameTR}</Text>
                  <Text style={styles.productPrice}>{product.priceTL} TL / {product.unitTR}</Text>
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
          <Text style={styles.sectionTitle}>Haftanın Pazar Seti</Text>
          <Card style={styles.bundleCard}>
            <View style={styles.bundleContent}>
              <View style={styles.bundleInfo}>
                <Text style={styles.bundleTitle}>20 Kg Taptaze Ürün Seti</Text>
                <View style={styles.distanceBadge}>
                  <MapPin size={12} color={COLORS.textSecondary} />
                  <Text style={styles.distanceText}>{market.distanceMeters}m</Text>
                </View>
              </View>
              <View style={styles.bundleActions}>
                <Button 
                  title="Sipariş Ver" 
                  size="small" 
                  onPress={handleOrder}
                />
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bilgi:</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pazartesi – Cuma:</Text>
            <Text style={styles.infoValue}>{market.hours.weekdays}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cumartesi – Pazar:</Text>
            <Text style={styles.infoValue}>{market.hours.weekends}</Text>
          </View>
          <View style={styles.divider} />
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
  bundleCard: {
    padding: SPACING.m,
  },
  bundleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bundleInfo: {
    flex: 1,
  },
  bundleTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bundleActions: {
    alignItems: 'flex-end',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  infoLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  infoValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.m,
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
