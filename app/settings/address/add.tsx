import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';

export default function AddAddressScreen() {
  const router = useRouter();
  const addAddress = useStore((state) => state.addAddress);

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [details, setDetails] = useState('');

  const handleSave = () => {
    if (!title || !address || !district) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun.');
      return;
    }

    addAddress({
      id: Date.now().toString(),
      title,
      fullAddress: address,
      district,
      neighborhood,
      details
    });

    Alert.alert('Başarılı', 'Adres kaydedildi.');
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
        <Text style={styles.title}>Yeni Adres Ekle</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adres Başlığı</Text>
          <TextInput 
            style={styles.input} 
            value={title} 
            onChangeText={setTitle} 
            placeholder="Örn: Ev, İş"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>İlçe</Text>
          <TextInput 
            style={styles.input} 
            value={district} 
            onChangeText={setDistrict} 
            placeholder="Örn: Mezitli"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mahalle</Text>
          <TextInput 
            style={styles.input} 
            value={neighborhood} 
            onChangeText={setNeighborhood} 
            placeholder="Örn: Viranşehir Mah."
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Açık Adres</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={address} 
            onChangeText={setAddress} 
            placeholder="Cadde, sokak, bina no..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kat / Daire (Opsiyonel)</Text>
          <TextInput 
            style={styles.input} 
            value={details} 
            onChangeText={setDetails} 
            placeholder="Kat 3, Daire 5"
          />
        </View>

        <Button title="Adresi Kaydet" onPress={handleSave} style={styles.saveButton} />
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: SPACING.m,
  },
});
