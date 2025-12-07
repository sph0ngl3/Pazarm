import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sprout, TrendingUp, Clock, Handshake } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function PartnershipModelScreen() {
  const router = useRouter();

  const handleInvest = () => {
    Alert.alert(
      "Yatırım Talebi",
      "Talebiniz alınmıştır. Yatırım uzmanlarımız en kısa sürede sizinle iletişime geçecektir.",
      [{ text: "Tamam", onPress: () => router.back() }]
    );
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
        <Text style={styles.title}>Pazarm Ortaklık Modeli</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Handshake size={48} color={COLORS.freshGreen} />
          </View>
          <Text style={styles.heroTitle}>Hasada Ortak Ol, Kazancı Paylaş</Text>
          <Text style={styles.heroText}>
            PazarM Ortaklık Modeli ile yerel üreticilerin hasadına önceden yatırım yapın, ürünler satıldığında kâr payınızı alın.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Nasıl Çalışır?</Text>
        <Card style={styles.stepCard}>
          <View style={styles.stepRow}>
            <View style={styles.stepIcon}>
              <Sprout size={20} color={COLORS.white} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>1. Tarladan Çıkış</Text>
              <Text style={styles.stepDesc}>Hasat öncesi belirlenen ürünlere yatırım yapın.</Text>
            </View>
          </View>
          
          <View style={styles.connector} />

          <View style={styles.stepRow}>
            <View style={styles.stepIcon}>
              <TrendingUp size={20} color={COLORS.white} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>2. Değerlenme</Text>
              <Text style={styles.stepDesc}>Ürünler PazarM ağında satıldıkça değer kazanır.</Text>
            </View>
          </View>

          <View style={styles.connector} />

          <View style={styles.stepRow}>
            <View style={styles.stepIcon}>
              <Clock size={20} color={COLORS.white} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>3. Kazanç Paylaşımı</Text>
              <Text style={styles.stepDesc}>Belirlenen vade sonunda ana para + kâr payı hesabınıza yatar.</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Örnek Yatırım Tablosu</Text>
        <Card style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Tahmini Getiri Oranı</Text>
            <Text style={styles.statValue}>%15 - %25</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Tahmini Vade</Text>
            <Text style={styles.statValue}>4 - 8 Hafta</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Min. Yatırım Tutarı</Text>
            <Text style={styles.statValue}>5.000 TL</Text>
          </View>
        </Card>

        <View style={styles.ctaContainer}>
          <Button 
            title="Yatırım İçin Bize Ulaşın" 
            onPress={handleInvest} 
            size="large"
            icon={<Handshake size={20} color={COLORS.white} />}
          />
          <Text style={styles.disclaimer}>
            *Yatırım getirileri piyasa koşullarına göre değişiklik gösterebilir.
          </Text>
        </View>
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
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.m,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  heroTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  heroText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.m,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SPACING.m,
  },
  stepCard: {
    padding: SPACING.l,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  connector: {
    width: 2,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginLeft: 19, // Center with icon (40/2 - 1)
    marginVertical: 4,
  },
  statsCard: {
    padding: SPACING.m,
    backgroundColor: '#F8FAFC',
    marginBottom: SPACING.xl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.s,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.freshGreen,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  ctaContainer: {
    marginTop: SPACING.s,
  },
  disclaimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.m,
    opacity: 0.7,
  },
});
