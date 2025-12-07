import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { MapPin, Star } from 'lucide-react-native';
import { CATEGORIES, BUNDLES } from '@/data/sampleData';
import { PazarmHeader } from '@/components/PazarmHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Filter categories to ensure we don't show duplicates if any
  const dailyCategories = CATEGORIES.filter(c => c.type === 'daily');

  return (
    <View style={styles.container}>
      <PazarmHeader title="Ürünler" />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}>
        {/* Daily Categories Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <View style={styles.grid}>
            {dailyCategories.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => router.push(`/product/list?categoryId=${cat.id}&categoryTitleTR=${encodeURIComponent(cat.nameTR)}`)}
                style={styles.gridItemWrapper}
              >
                <CategoryCard title={cat.nameTR} distance="250m" imageUrl={cat.imageUrl} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weekly Bundles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Haftalık Abonelik Paketleri</Text>
          <View style={styles.verticalList}>
            {BUNDLES.map(bundle => (
              <TouchableOpacity 
                key={bundle.id} 
                onPress={() => router.push(`/bundle/${bundle.id}`)}
              >
                <BundleCard title={bundle.titleTR} rating={bundle.rating.toString()} imageUrl={bundle.imageUrl} />
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

const BundleCard = ({ title, rating, imageUrl }: { title: string, rating: string, imageUrl?: string }) => (
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
    width: '47%', // roughly 2 columns with gap
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
