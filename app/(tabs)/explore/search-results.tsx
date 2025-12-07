import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { ArrowLeft, MapPin, ChevronRight, Package } from 'lucide-react-native';
import { PRODUCTS, MARKETS, BUNDLES } from '@/data/sampleData';
import { Card } from '@/components/ui/Card';

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const router = useRouter();
  const query = (q || '').toLowerCase();

  const filteredProducts = PRODUCTS.filter(p => p.nameTR.toLowerCase().includes(query));
  const filteredMarkets = MARKETS.filter(m => m.nameTR.toLowerCase().includes(query));
  const filteredBundles = BUNDLES.filter(b => b.titleTR.toLowerCase().includes(query));

  const hasResults = filteredProducts.length > 0 || filteredMarkets.length > 0 || filteredBundles.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Arama Sonuçları</Text>
      </View>

      <View style={styles.queryContainer}>
        <Text style={styles.queryText}>"{q}" için sonuçlar:</Text>
      </View>

      {!hasResults ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aradığınız ürünü bulamadık.</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={
            <>
              {filteredProducts.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ürünler</Text>
                  {filteredProducts.map(item => (
                    <TouchableOpacity 
                      key={item.id} 
                      onPress={() => router.push(`/product/${item.id}`)}
                    >
                      <Card style={styles.resultCard}>
                        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                        <View style={styles.resultInfo}>
                          <Text style={styles.resultTitle}>{item.nameTR}</Text>
                          <Text style={styles.resultSubtitle}>{item.priceTL} TL / {item.unitTR}</Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.textSecondary} />
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {filteredBundles.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Paketler</Text>
                  {filteredBundles.map(item => (
                    <TouchableOpacity 
                      key={item.id} 
                      onPress={() => router.push(`/bundle/${item.id}`)}
                    >
                      <Card style={styles.resultCard}>
                        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                        <View style={styles.resultInfo}>
                          <Text style={styles.resultTitle}>{item.titleTR}</Text>
                          <Text style={styles.resultSubtitle}>{item.priceTL} TL</Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.textSecondary} />
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {filteredMarkets.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Pazar Noktaları</Text>
                  {filteredMarkets.map(item => (
                    <TouchableOpacity 
                      key={item.id} 
                      onPress={() => router.push(`/explore/location/${item.id}`)}
                    >
                      <Card style={styles.resultCard}>
                        <View style={styles.marketIcon}>
                          <MapPin size={20} color={COLORS.white} />
                        </View>
                        <View style={styles.resultInfo}>
                          <Text style={styles.resultTitle}>{item.nameTR}</Text>
                          <Text style={styles.resultSubtitle}>{item.distanceMeters}m • {item.rating} ★</Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.textSecondary} />
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  backButton: {
    marginRight: SPACING.m,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  queryContainer: {
    padding: SPACING.m,
    backgroundColor: COLORS.card,
  },
  queryText: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.textSecondary,
  },
  listContent: {
    padding: SPACING.m,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
    padding: SPACING.s,
    backgroundColor: COLORS.white,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.s,
    marginRight: SPACING.m,
    backgroundColor: '#eee',
  },
  marketIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.s,
    marginRight: SPACING.m,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  resultSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});
