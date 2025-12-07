import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from '@/components/NativeMap';
import { useStore } from '@/store/useStore';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { MapPin, Navigation, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const { width, height } = Dimensions.get('window');

const INITIAL_REGION = {
  latitude: 36.777,
  longitude: 34.527,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function MarketsMapScreen() {
  const router = useRouter();
  const { nearbyMarkets } = useStore();
  const [region, setRegion] = useState(INITIAL_REGION);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      }
    })();
  }, []);

  const selectedMarket = nearbyMarkets.find(m => m.id === selectedMarketId);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        onPress={() => setSelectedMarketId(null)}
      >
        {nearbyMarkets.map((market) => (
          <Marker
            key={market.id}
            coordinate={market.coordinates}
            title={market.nameTR}
            description={market.address}
            onPress={(e: any) => {
              e.stopPropagation();
              setSelectedMarketId(market.id);
            }}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerBubble, selectedMarketId === market.id && styles.selectedMarker]}>
                <MapPin size={20} color={COLORS.white} fill={COLORS.white} />
              </View>
              <View style={[styles.markerArrow, selectedMarketId === market.id && styles.selectedArrow]} />
            </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>

      {selectedMarket && (
        <View style={styles.bottomSheet}>
          <Card style={styles.marketCard}>
            <Text style={styles.marketName}>{selectedMarket.nameTR}</Text>
            <Text style={styles.marketAddress}>{selectedMarket.address}</Text>
            <Text style={styles.marketDistance}>{selectedMarket.distanceMeters}m uzaklıkta</Text>
            
            <View style={styles.actions}>
              <Button 
                title="PazarM Noktasına Git" 
                variant="outline"
                size="small"
                icon={<Navigation size={16} color={COLORS.textPrimary} />}
                onPress={() => {
                  alert("Navigasyon başlatılıyor...");
                }}
                style={{ flex: 1 }}
              />
              <Button 
                title="Bu Noktadaki Ürünler" 
                size="small"
                onPress={() => router.push(`/explore/location/${selectedMarket.id}`)}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    width: width,
    height: height,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    backgroundColor: COLORS.freshGreen,
    padding: 8,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  selectedMarker: {
    backgroundColor: COLORS.deepBlue,
    transform: [{ scale: 1.2 }],
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 0,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.freshGreen,
    marginTop: -1,
  },
  selectedArrow: {
    borderTopColor: COLORS.deepBlue,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  marketCard: {
    padding: SPACING.m,
  },
  marketName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  marketAddress: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  marketDistance: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: COLORS.freshGreen,
    marginBottom: SPACING.m,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.s,
  },
});
