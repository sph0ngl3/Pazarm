import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, Platform, ScrollView, Image } from 'react-native';
import { Search, MapPin, Map as MapIcon, Clock, ChevronRight, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { useStore } from '@/store/useStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useCartStore } from '@/store/useCartStore';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from '@/components/NativeMap';
import { SeasonalSection } from '@/components/SeasonalSection';
import { Card } from '@/components/ui/Card';
import { PazarmHeader } from '@/components/PazarmHeader';
import { PRODUCTS } from '@/data/sampleData';
import { useToast } from '@/components/ui/Toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: 36.7667,
  longitude: 34.5333,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function ExploreMapScreen() {
  const router = useRouter();
  const { nearbyMarkets } = useStore();
  const { status, activeOrder } = useOrderStore();
  const { addItem } = useCartStore();
  const { showToast } = useToast();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState(DEFAULT_REGION);
  const insets = useSafeAreaInsets();

  // Curated picks for "Weekly Suggestions"
  const weeklyPicks = PRODUCTS.slice(0, 3); 

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
    })();
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/explore/search-results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAddToCart = (item: any) => {
    addItem({
      refId: item.id,
      type: 'product',
      nameTR: item.nameTR,
      unitTR: item.unitTR,
      priceTL: item.priceTL,
      quantity: 1,
      imageUrl: item.imageUrl
    });
    showToast(`Sepete eklendi: ${item.nameTR}`);
  };

  const showTrackingWidget = status === 'active' && activeOrder;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        customMapStyle={[{ "featureType": "poi", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] }]}
      >
        {nearbyMarkets.map((market) => (
          <Marker
            key={market.id}
            coordinate={market.coordinates}
            onPress={() => router.push(`/explore/location/${market.id}`)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerBubble}>
                <MapPin size={20} color={COLORS.white} fill={COLORS.white} />
              </View>
              <View style={styles.markerArrow} />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.topBar}>
        <PazarmHeader />
        
        <View style={styles.overlayWrapper}>
           {showTrackingWidget ? (
             <TouchableOpacity 
               style={styles.trackingWidget}
               onPress={() => router.push('/explore/tracking')}
             >
               <View style={styles.trackingHeader}>
                 <Text style={styles.trackingTitle}>Siparişiniz Yolda</Text>
                 <View style={styles.etaBadge}>
                   <Clock size={12} color={COLORS.white} />
                   <Text style={styles.etaText}>{activeOrder?.etaMinutes} dk</Text>
                 </View>
               </View>
               <Text style={styles.trackingSub}>
                 {activeOrder?.items.length} ürün hazırlanıyor ve size doğru geliyor.
               </Text>
               <View style={styles.trackingAction}>
                 <Text style={styles.trackingLink}>Takip Et</Text>
                 <ChevronRight size={16} color={COLORS.freshGreen} />
               </View>
             </TouchableOpacity>
           ) : (
             <ScrollView 
               style={{ maxHeight: 550 }} 
               contentContainerStyle={{ paddingBottom: 100 }} // Increased padding
               showsVerticalScrollIndicator={false}
             >
               <SeasonalSection />
               
               {/* Weekly Suggestions */}
               <View style={styles.picksSection}>
                 <View style={styles.sectionHeader}>
                   <Text style={styles.sectionTitle}>Haftanın Önerileri</Text>
                   <Text style={styles.sectionSubtitle}>Sizin için seçtiğimiz özel ürünler</Text>
                 </View>
                 
                 <View style={styles.picksList}>
                   {weeklyPicks.map(item => (
                     <TouchableOpacity 
                        key={item.id} 
                        style={styles.pickCard}
                        onPress={() => router.push(`/product/${item.id}`)}
                     >
                       <Image source={{ uri: item.imageUrl }} style={styles.pickImage} />
                       <View style={styles.pickContent}>
                         <Text style={styles.pickName} numberOfLines={1}>{item.nameTR}</Text>
                         <Text style={styles.pickPrice}>{item.priceTL} TL <Text style={styles.pickUnit}>/ {item.unitTR}</Text></Text>
                       </View>
                       <TouchableOpacity 
                         style={styles.pickAddBtn}
                         onPress={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                       >
                         <Plus size={16} color={COLORS.white} />
                       </TouchableOpacity>
                     </TouchableOpacity>
                   ))}
                 </View>
               </View>

               {/* Discover Markets */}
               <View style={styles.marketsSection}>
                  <Text style={styles.sectionTitle}>PazarM noktalarını keşfet</Text>
                  <Text style={styles.sectionSubtitle}>Mahallene en yakın toplama noktaları.</Text>
                  
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marketsList}>
                    {nearbyMarkets.sort((a,b) => a.distanceMeters - b.distanceMeters).map(market => (
                      <TouchableOpacity 
                        key={market.id}
                        onPress={() => router.push(`/explore/location/${market.id}`)}
                      >
                        <Card style={styles.marketCard}>
                          <View style={styles.marketIcon}>
                            <MapPin size={16} color={COLORS.white} />
                          </View>
                          <View>
                            <Text style={styles.marketName}>{market.nameTR}</Text>
                            <Text style={styles.marketDistance}>{market.distanceMeters}m</Text>
                          </View>
                        </Card>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity 
                    style={styles.mapCta} 
                    onPress={() => router.push('/explore/markets-map')}
                  >
                    <MapIcon size={16} color={COLORS.freshGreen} />
                    <Text style={styles.mapCtaText}>Haritada Gör</Text>
                  </TouchableOpacity>
               </View>
             </ScrollView>
           )}
        </View>
      </View>

      <View style={[styles.bottomContainer, { bottom: 20 + insets.bottom }]}>
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput 
            placeholder="Ürün Ara, Kategori Bul…" 
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Ara</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  overlayWrapper: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomLeftRadius: RADIUS.l,
    borderBottomRightRadius: RADIUS.l,
    paddingBottom: SPACING.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  trackingWidget: {
    margin: SPACING.m,
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  trackingTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.freshGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  etaText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.white,
  },
  trackingSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.m,
  },
  trackingAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  trackingLink: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.freshGreen,
  },
  // Section Headers
  sectionHeader: {
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.s,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  // Picks Section
  picksSection: {
    marginTop: SPACING.s,
    marginBottom: SPACING.m,
  },
  picksList: {
    paddingHorizontal: SPACING.m,
    gap: SPACING.s,
  },
  pickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.s,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  pickImage: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.s,
    backgroundColor: '#F1F5F9',
  },
  pickContent: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  pickName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  pickPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: COLORS.freshGreen,
  },
  pickUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  pickAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Markets Section
  marketsSection: {
    paddingHorizontal: SPACING.m,
    marginTop: SPACING.s,
  },
  marketsList: {
    gap: SPACING.s,
    paddingBottom: SPACING.s,
    marginTop: SPACING.s,
  },
  marketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.s,
    backgroundColor: COLORS.white,
    gap: SPACING.s,
    minWidth: 140,
  },
  marketIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  marketDistance: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  mapCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: SPACING.s,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  mapCtaText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.freshGreen,
  },
  bottomContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.m,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.s,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  searchButton: {
    paddingHorizontal: SPACING.s,
  },
  searchButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.freshGreen,
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
});
