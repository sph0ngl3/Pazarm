import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(true);
  const [campaigns, setCampaigns] = useState(true);
  const [sms, setSms] = useState(false);

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
        <Text style={styles.title}>Bildirimler</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Sipariş durumu bildirimleri</Text>
          <Switch 
            value={orderStatus} 
            onValueChange={setOrderStatus}
            trackColor={{ false: "#767577", true: COLORS.freshGreen }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kampanya bildirimleri</Text>
          <Switch 
            value={campaigns} 
            onValueChange={setCampaigns}
            trackColor={{ false: "#767577", true: COLORS.freshGreen }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>SMS ile bilgilendirme</Text>
          <Switch 
            value={sms} 
            onValueChange={setSms}
            trackColor={{ false: "#767577", true: COLORS.freshGreen }}
          />
        </View>
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
  content: {
    padding: SPACING.l,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
});
