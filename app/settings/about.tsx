import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Leaf } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

export default function AboutScreen() {
  const router = useRouter();

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
        <Text style={styles.title}>Pazarım Hakkında</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Leaf size={40} color={COLORS.freshGreen} fill={COLORS.freshGreen} />
          </View>
          <Text style={styles.appName}>PazarM</Text>
          <Text style={styles.version}>Versiyon 1.0.0</Text>
        </View>

        <Text style={styles.sectionTitle}>Biz Kimiz?</Text>
        <Text style={styles.paragraph}>
          PazarM, mahalle pazarını evinize taşıyan yeni nesil bir teslimat uygulamasıdır. Amacımız, taze ve doğal ürünlere ulaşımı kolaylaştırmak, yerel üreticileri desteklemek ve size zaman kazandırmaktır.
        </Text>

        <Text style={styles.sectionTitle}>Neden PazarM?</Text>
        <Text style={styles.paragraph}>
          • <Text style={styles.bold}>Haftalık 20KG Setler:</Text> Ailenizin haftalık sebze ve meyve ihtiyacını tek pakette sunuyoruz.
          {'\n'}• <Text style={styles.bold}>Uygun Fiyat:</Text> Pazar fiyatlarıyla market konforunu birleştiriyoruz.
          {'\n'}• <Text style={styles.bold}>GPS Takip:</Text> Siparişinizin hangi pazar noktasından yola çıktığını canlı izleyin.
        </Text>

        <Text style={styles.footerText}>
          © 2025 PazarM Teknoloji A.Ş. Tüm hakları saklıdır.
        </Text>
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
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.m,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: SPACING.m,
  },
  appName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  version: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
    marginTop: SPACING.m,
  },
  paragraph: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.m,
  },
  bold: {
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
    opacity: 0.6,
  },
});
