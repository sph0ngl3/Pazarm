import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

export default function PartnershipScreen() {
  const router = useRouter();
  const [marketName, setMarketName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    Alert.alert('Başvurunuz Alındı', 'Bayilik başvurunuz bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.');
    router.back();
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
        <Text style={styles.title}>Bayilik Başvurusu</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          PazarM ailesine katılın! Mahallenizdeki pazar noktamız olun, taze ürünleri komşularınıza ulaştırırken kazancınızı artırın.
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pazar / Market Adı</Text>
            <TextInput 
              style={styles.input} 
              value={marketName} 
              onChangeText={setMarketName} 
              placeholder="İşletme Adı"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mahalle</Text>
            <TextInput 
              style={styles.input} 
              value={neighborhood} 
              onChangeText={setNeighborhood} 
              placeholder="Bulunduğunuz Mahalle"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefon</Text>
            <TextInput 
              style={styles.input} 
              value={phone} 
              onChangeText={setPhone} 
              keyboardType="phone-pad"
              placeholder="İletişim Numarası"
            />
          </View>

          <Button title="Başvuru Formunu Gönder" onPress={handleSubmit} style={styles.submitButton} />
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
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  form: {},
  inputGroup: {
    marginBottom: SPACING.l,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  submitButton: {
    marginTop: SPACING.m,
  },
});
