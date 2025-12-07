import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Coins } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function OrderConfirmedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const earned = Number(params.earned) || 0;
  const used = Number(params.used) || 0;
  const hasSubscription = params.hasSubscription === '1';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle2 size={64} color={COLORS.freshGreen} />
        </View>
        
        <Text style={styles.title}>Siparişiniz Alındı</Text>
        <Text style={styles.message}>
          Siparişiniz, PazarM noktalarımızdan her zaman taze ürünlerle hazırlanıp size ulaştırılacaktır.
        </Text>

        <Card style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Teslimat Türü:</Text>
            <Text style={styles.value}>
              {hasSubscription ? 'Abonelik + Tek Seferlik' : 'Tek Seferlik Teslimat'}
            </Text>
          </View>
          
          {hasSubscription && (
            <Text style={styles.subNote}>
              1 aylık abonelikte, kalan 3 hafta aynı gün ve aynı sipariş içeriğiyle otomatik olarak teslim edilir. Aylık abonelik siz iptal edene kadar her ay yenilenir.
            </Text>
          )}

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.iconLabel}>
              <Coins size={16} color={COLORS.warning} />
              <Text style={styles.label}>Kazanılan M Puan:</Text>
            </View>
            <Text style={[styles.value, { color: COLORS.warning }]}>+{earned} Puan</Text>
          </View>

          {used > 0 && (
            <View style={[styles.row, { marginTop: 8 }]}>
              <Text style={styles.label}>Kullanılan İndirim:</Text>
              <Text style={styles.value}>-{used.toFixed(2)} TL</Text>
            </View>
          )}
        </Card>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Teslimatı Takip Et" 
          onPress={() => router.replace('/explore/tracking')} 
          size="large"
          style={{ marginBottom: SPACING.m }}
        />
        <Button 
          title="Ana sayfaya dön" 
          onPress={() => router.replace('/(tabs)/explore')} 
          variant="ghost"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    padding: SPACING.l,
    paddingTop: 80,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.l,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.m,
  },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.m,
  },
  infoCard: {
    width: '100%',
    padding: SPACING.m,
    backgroundColor: COLORS.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  value: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  subNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.freshGreen,
    marginTop: 8,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.m,
  },
  footer: {
    width: '100%',
  },
});
