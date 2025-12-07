import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

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
        <Text style={styles.title}>Şifre ve Güvenlik</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionHeader}>Giriş Güvenliği</Text>
        <Text style={styles.description}>
          Hesabınıza daha hızlı ve güvenli giriş yapmak için biyometrik verilerinizi kullanabilirsiniz.
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Touch ID / Face ID ile giriş</Text>
          <Switch 
            value={biometric} 
            onValueChange={setBiometric}
            trackColor={{ false: "#767577", true: COLORS.freshGreen }}
          />
        </View>

        <Text style={styles.sectionHeader}>Ek Doğrulama</Text>
        <Text style={styles.description}>
          Hesabınızı korumak için WhatsApp üzerinden iki faktörlü doğrulama kodunu aktif edebilirsiniz.
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Whatsapp 2FA aktif</Text>
          <Switch 
            value={twoFactor} 
            onValueChange={setTwoFactor}
            trackColor={{ false: "#767577", true: COLORS.freshGreen }}
          />
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
  },
  sectionHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.m,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    marginBottom: SPACING.l,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
});
