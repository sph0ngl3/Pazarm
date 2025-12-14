import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';

export default function MarketsListScreen() {
  const router = useRouter();
  const { nearbyMarkets, fetchMarkets } = useStore();

  useEffect(() => {
    fetchMarkets();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Button 
          title="" 
          icon={<ArrowLeft size={24} color={COLORS.textPrimary} />} 
          onPress={() => router.back()} 
          variant="ghost"
          style={styles.backButton}
        />
        <Text style={styles.title}>PazarM Noktaları</Text>
      </View>

      <FlatList
        data={nearbyMarkets.sort((a,b) => (a.distanceMeters || 0) - (b.distanceMeters || 0))}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/explore/location/${item.id}`)}>
            <Card style={styles.card}>
              <View style={styles.iconContainer}>
                <MapPin size={24} color={COLORS.white} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
                <View style={styles.metaRow}>
                    <Text style={styles.distance}>{item.distanceMeters}m uzaklıkta</Text>
                    <Text style={styles.rating}>★ {item.rating}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={COLORS.textSecondary} />
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
             <Text style={styles.emptyText}>Yakınınızda PazarM noktası bulunamadı.</Text>
          </View>
        }
      />
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
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginRight: SPACING.s,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  list: {
    padding: SPACING.m,
    gap: SPACING.m,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.m,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  address: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  distance: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.freshGreen,
  },
  rating: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#F59E0B',
  },
  empty: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
  },
});
