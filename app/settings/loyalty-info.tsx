import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Coins, X } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

export default function LoyaltyInfoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>M Puan Nedir?</Text>
          <Button 
            title="" 
            icon={<X size={24} color={COLORS.textPrimary} />} 
            onPress={() => router.back()} 
            variant="ghost" 
            style={styles.closeButton}
          />
        </View>

        <View style={styles.iconContainer}>
          <Coins size={64} color={COLORS.warning} fill={COLORS.warning} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nasıl Kazanılır?</Text>
          <Text style={styles.text}>
            Her 100 TL alışverişiniz için 1 TL değerinde M Puan kazanırsınız. Puanlarınız siparişiniz tamamlandıktan sonra hesabınıza yüklenir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nasıl Kullanılır?</Text>
          <Text style={styles.text}>
            Ödeme ekranında "M puanla indirim al" seçeneğini aktif ederek birikmiş puanlarınızı anında indirim olarak kullanabilirsiniz.
          </Text>
        </View>

        <Button title="Tamam" onPress={() => router.back()} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.l,
    padding: SPACING.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  button: {
    marginTop: SPACING.m,
  },
});
