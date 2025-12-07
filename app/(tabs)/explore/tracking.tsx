import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from '@/components/NativeMap';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { CheckCircle2 } from 'lucide-react-native';
import { PazarmHeader } from '@/components/PazarmHeader';
import { useOrderStore } from '@/store/useOrderStore';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

export default function OrderTrackingScreen() {
  const { activeOrder, completeOrder } = useOrderStore();
  const router = useRouter();
  
  const initialRegion = {
    latitude: 36.7667,
    longitude: 34.5333,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const routeCoords = [
    { latitude: 36.7667, longitude: 34.5333 },
    { latitude: 36.7680, longitude: 34.5350 },
    { latitude: 36.7700, longitude: 34.5400 },
  ];

  const handleCompleteDemo = () => {
    completeOrder();
    router.replace('/(tabs)/explore');
  };

  if (!activeOrder) {
     return (
        <View style={styles.container}>
            <PazarmHeader title="Sipariş Takibi" showBack />
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Aktif siparişiniz yok</Text>
                <Text style={styles.emptyText}>Şu anda takip edilecek bir siparişiniz bulunmuyor.</Text>
                <Button 
                  title="Ürünlere Göz At" 
                  onPress={() => router.replace('/(tabs)/saved')} 
                  style={{ marginTop: 20 }} 
                />
            </View>
        </View>
     )
  }

  return (
    <View style={styles.container}>
      <PazarmHeader title="Sipariş Takibi" showBack />
      
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
      >
        <Marker coordinate={routeCoords[0]} />
        <Marker coordinate={routeCoords[2]} pinColor={COLORS.freshGreen} />
        <Polyline 
          coordinates={routeCoords}
          strokeColor={COLORS.deepBlue}
          strokeWidth={4}
        />
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text style={styles.breadcrumb}>Pazarım {'>'} Sipariş Detayları</Text>
          <Text style={styles.statusTitle}>Size Doğru Yola Çıktık.</Text>
          <Text style={styles.etaText}>{activeOrder.etaMinutes} dakika</Text>
        </View>

        <Text style={styles.description}>
          Siparişiniz, PazarM noktalarımızdan her zaman taze ürünlerle hazırlanıp size ulaştırılacaktır.
        </Text>

        <ScrollView style={styles.orderList}>
          {activeOrder.items.map((item, index) => (
             <OrderItem key={index} title={item.nameTR} subtitle={`${item.quantity} x ${item.unitTR}`} />
          ))}
        </ScrollView>
        
        <TouchableOpacity onPress={handleCompleteDemo} style={styles.demoButton}>
            <Text style={styles.demoButtonText}>[DEMO] Siparişi Teslim Et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const OrderItem = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <View style={styles.orderItem}>
    <View style={styles.checkIcon}>
      <CheckCircle2 size={16} color={COLORS.white} />
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
  },
  emptyTitle: {
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      color: COLORS.textPrimary,
      marginBottom: 8,
  },
  emptyText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: COLORS.textSecondary,
      textAlign: 'center',
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    height: '55%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.cardBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.l,
  },
  header: {
    marginBottom: SPACING.m,
  },
  breadcrumb: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statusTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  etaText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.freshGreen,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.l,
  },
  orderList: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
    paddingBottom: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  demoButton: {
      padding: 10,
      alignItems: 'center',
      marginTop: 10,
  },
  demoButtonText: {
      color: COLORS.textSecondary,
      fontSize: 12,
      fontFamily: 'Inter_500Medium',
  }
});
