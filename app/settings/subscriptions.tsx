import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Package } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import { useStore } from '@/store/useStore';
import { Subscription } from '@/types';

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { user } = useStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('profile_id', user?.id);
    
    if (data) setSubscriptions(data);
  };

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
        <Text style={styles.title}>Aboneliklerim</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {subscriptions.length === 0 ? (
          <Text style={styles.emptyText}>Aktif aboneliğiniz bulunmuyor.</Text>
        ) : (
          subscriptions.map(sub => (
            <Card key={sub.id} style={styles.subCard}>
              <View style={styles.subHeader}>
                <View style={styles.iconBox}>
                  <Package size={20} color={COLORS.freshGreen} />
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Aktif</Text>
                </View>
              </View>
              
              <Text style={styles.bundleName}>{sub.name}</Text>
              
              <View style={styles.row}>
                <Calendar size={16} color={COLORS.textSecondary} />
                <Text style={styles.dateText}>Sonraki Teslimat: {new Date(sub.next_delivery_date).toLocaleDateString('tr-TR')}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.priceRow}>
                <Text style={styles.label}>Aylık Tutar</Text>
                <Text style={styles.price}>{sub.monthly_price?.toFixed(2)} TL</Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
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
  content: {
    padding: SPACING.l,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 20,
    fontFamily: 'Inter_400Regular',
  },
  subCard: {
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.m,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#166534',
  },
  bundleName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.m,
  },
  dateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginBottom: SPACING.m,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  price: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.freshGreen,
  },
});
