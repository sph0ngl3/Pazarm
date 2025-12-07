import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const [name, setName] = useState('Demo User');
  const [phone, setPhone] = useState('555 123 45 67');
  const [email, setEmail] = useState('demo@pazarm.com');

  const handleSave = () => {
    Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
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
        <Text style={styles.title}>Profil Ayarları</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Ad Soyad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefon Numarası</Text>
          <TextInput 
            style={styles.input} 
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="phone-pad"
            placeholder="5XX XXX XX XX"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
            placeholder="ornek@email.com"
          />
        </View>

        <Button title="Kaydet" onPress={handleSave} style={styles.saveButton} />
      </View>
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
  form: {
    padding: SPACING.l,
  },
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
  saveButton: {
    marginTop: SPACING.m,
  },
});
