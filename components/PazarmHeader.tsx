import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Cloud, Wind, Droplets, Info } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/store/useStore';

interface PazarmHeaderProps {
  title?: string;
  showBack?: boolean;
}

// Using the square logo icon provided
const APP_ICON = 'https://i.ibb.co/78tp1Jw/icon.png';

export const PazarmHeader: React.FC<PazarmHeaderProps> = ({ title, showBack }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addresses = useStore(state => state.addresses);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  
  const currentLocation = addresses[0]?.neighborhood || 'Viranşehir Mah.';

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.content}>
          <View style={styles.leftContainer}>
            {showBack ? (
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ArrowLeft size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            ) : (
              <Image 
                source={{ uri: APP_ICON }} 
                style={styles.logo} 
                resizeMode="contain"
              />
            )}
          </View>
          
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <View style={styles.locationContainer}>
              <Text style={styles.locationLabel}>Mahallen</Text>
              <Text style={styles.locationText}>{currentLocation}</Text>
            </View>
          )}
          
          <View style={styles.rightContainer}>
            {!title ? (
              <TouchableOpacity 
                style={styles.weatherBadge}
                onPress={() => setWeatherModalVisible(true)}
              >
                <Cloud size={14} color={COLORS.textSecondary} />
                <Text style={styles.weatherText}>28°C</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} /> 
            )}
          </View>
        </View>
      </View>

      <Modal
        visible={weatherModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWeatherModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setWeatherModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Hava Durumu</Text>
                  <TouchableOpacity onPress={() => setWeatherModalVisible(false)}>
                    <Text style={styles.closeText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.weatherMain}>
                  <Cloud size={64} color={COLORS.deepBlue} />
                  <Text style={styles.tempLarge}>28°C</Text>
                  <Text style={styles.condition}>Parçalı Bulutlu</Text>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Wind size={20} color={COLORS.textSecondary} />
                    <Text style={styles.statValue}>12 km/s</Text>
                    <Text style={styles.statLabel}>Rüzgar</Text>
                  </View>
                  <View style={styles.dividerVertical} />
                  <View style={styles.statItem}>
                    <Droplets size={20} color={COLORS.textSecondary} />
                    <Text style={styles.statValue}>%45</Text>
                    <Text style={styles.statLabel}>Nem</Text>
                  </View>
                </View>

                <View style={styles.suggestionBox}>
                  <Info size={20} color="#0369A1" />
                  <Text style={styles.suggestionText}>
                    Hava bugün güzel görünüyor, pazar alışverişi için harika bir gün!
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 100,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
  },
  leftContainer: {
    minWidth: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  locationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  locationLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  locationText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  weatherText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.l,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  closeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  weatherMain: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  tempLarge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 48,
    color: COLORS.textPrimary,
    marginVertical: SPACING.s,
  },
  condition: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.l,
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.cardBorder,
  },
  suggestionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    gap: SPACING.m,
  },
  suggestionText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
});
