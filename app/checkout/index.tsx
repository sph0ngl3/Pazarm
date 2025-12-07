import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, CreditCard, Banknote, Calendar, Coins } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { useStore } from '@/store/useStore';
import { useLoyaltyStore } from '@/store/useLoyaltyStore';
import { useOrderStore } from '@/store/useOrderStore';
import { Card } from '@/components/ui/Card';
import { PazarmHeader } from '@/components/PazarmHeader';

export default function CheckoutScreen() {
  const router = useRouter();
  const { getTotals, clearCart, items } = useCartStore();
  const { addresses } = useStore();
  const { points, addPoints, redeemPoints } = useLoyaltyStore();
  const { startOrder } = useOrderStore();
  
  const { oneTimeTotalTL, subscriptionTotalTL, grandTotalTL } = getTotals();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [usePoints, setUsePoints] = useState(false);
  
  // Use first address as default
  const selectedAddress = addresses[0];

  // Calculate Loyalty Logic
  const maxDiscount = Math.min(points, grandTotalTL);
  const discountAmount = usePoints ? maxDiscount : 0;
  const finalTotal = grandTotalTL - discountAmount;
  const earnedPoints = Math.floor(finalTotal / 100);

  const handleOrder = () => {
    if (items.length === 0) {
      Alert.alert("Hata", "Sepetiniz boş.");
      return;
    }

    // Start the order in OrderStore
    startOrder({
      id: `ord_${Date.now()}`,
      marketId: 'm1', // Demo market
      etaMinutes: 15,
      items: [...items]
    });

    if (usePoints && discountAmount > 0) {
      redeemPoints(discountAmount);
    }
    
    addPoints(earnedPoints);
    clearCart();
    
    router.replace({
      pathname: '/order-confirmed',
      params: {
        earned: earnedPoints,
        used: discountAmount,
        total: finalTotal,
        hasSubscription: items.some(i => i.isSubscription) ? '1' : '0'
      }
    });
  };

  const hasSubscription = items.some(i => i.isSubscription);
  const hasOneTime = items.some(i => !i.isSubscription);

  return (
    <View style={styles.container}>
      <PazarmHeader title="Ödeme" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Delivery Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teslimat Türü</Text>
          
          {hasOneTime && (
            <Card style={styles.optionCard}>
              <View style={styles.optionIcon}>
                <MapPin size={20} color={COLORS.freshGreen} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Tek Seferlik Teslimat</Text>
                <Text style={styles.optionSubtitle}>En kısa sürede (Tahmini 15-30 dk)</Text>
              </View>
            </Card>
          )}

          {hasSubscription && (
            <Card style={[styles.optionCard, { marginTop: SPACING.s }]}>
              <View style={styles.optionIcon}>
                <Calendar size={20} color={COLORS.deepBlue} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Abonelik Teslimatı</Text>
                <Text style={styles.optionSubtitle}>Her Pazar sabah 08:00–11:00 arası</Text>
                <Text style={styles.optionInfo}>
                  Abonelikleriniz 1 aylık sözleşme kapsamında, her pazar sabah kapınıza teslim edilir.
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
          <Card style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressType}>{selectedAddress.title}</Text>
              <TouchableOpacity onPress={() => router.push('/settings')}>
                <Text style={styles.changeLink}>Değiştir</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.addressText}>{selectedAddress.fullAddress}</Text>
          </Card>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
          
          <TouchableOpacity onPress={() => setPaymentMethod('cash')}>
            <Card style={[styles.paymentCard, paymentMethod === 'cash' && styles.selectedPayment]}>
              <View style={styles.paymentRow}>
                <Banknote size={20} color={COLORS.textPrimary} />
                <Text style={styles.paymentText}>Kapıda Nakit</Text>
              </View>
              <View style={[styles.radio, paymentMethod === 'cash' && styles.radioSelected]} />
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setPaymentMethod('card')} style={{ marginTop: SPACING.s }}>
            <Card style={[styles.paymentCard, paymentMethod === 'card' && styles.selectedPayment]}>
              <View style={styles.paymentRow}>
                <CreditCard size={20} color={COLORS.textPrimary} />
                <Text style={styles.paymentText}>Kapıda Kart</Text>
              </View>
              <View style={[styles.radio, paymentMethod === 'card' && styles.radioSelected]} />
            </Card>
          </TouchableOpacity>

          <TouchableOpacity disabled={true} style={{ marginTop: SPACING.s, opacity: 0.6 }}>
            <Card style={styles.paymentCard}>
              <View style={styles.paymentRow}>
                <CreditCard size={20} color={COLORS.textSecondary} />
                <View>
                  <Text style={[styles.paymentText, { color: COLORS.textSecondary }]}>Online Kart Ödeme (yakında)</Text>
                  <Text style={styles.disabledText}>Çok yakında uygulama içi kart ödemesi aktif olacak.</Text>
                </View>
              </View>
              <View style={styles.radio} />
            </Card>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özet</Text>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tek Seferlik Toplam</Text>
              <Text style={styles.summaryValue}>{oneTimeTotalTL.toFixed(2)} TL</Text>
            </View>
            {subscriptionTotalTL > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Abonelik Toplamı (Aylık)</Text>
                <Text style={[styles.summaryValue, { color: COLORS.freshGreen }]}>
                  {subscriptionTotalTL.toFixed(2)} TL
                </Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            {/* Loyalty Points */}
            <View style={styles.loyaltyRow}>
              <View style={styles.loyaltyInfo}>
                <Coins size={16} color={COLORS.warning} />
                <Text style={styles.loyaltyText}>M Puan Bakiyeniz: {points} TL</Text>
              </View>
              <View style={styles.loyaltyToggle}>
                <Text style={styles.loyaltyLabel}>M puanla indirim al</Text>
                <Switch 
                  value={usePoints} 
                  onValueChange={setUsePoints}
                  trackColor={{ false: "#E2E8F0", true: COLORS.freshGreen }}
                />
              </View>
            </View>

            {usePoints && discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>M Puan İndirimi</Text>
                <Text style={[styles.summaryValue, { color: COLORS.freshGreen }]}>
                  -{discountAmount.toFixed(2)} TL
                </Text>
              </View>
            )}

            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Genel Toplam</Text>
              <Text style={styles.totalValue}>{finalTotal.toFixed(2)} TL</Text>
            </View>
            <Text style={styles.totalNote}>*İlk teslimat ödemesi</Text>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Siparişi Onayla" onPress={handleOrder} size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.m,
    paddingBottom: 100,
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
  optionCard: {
    flexDirection: 'row',
    padding: SPACING.m,
    backgroundColor: COLORS.white,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  optionInfo: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  addressCard: {
    padding: SPACING.m,
    backgroundColor: COLORS.white,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  addressType: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  changeLink: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: COLORS.freshGreen,
  },
  addressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedPayment: {
    borderColor: COLORS.freshGreen,
    backgroundColor: '#F0FDF4',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  paymentText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  disabledText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  radioSelected: {
    borderColor: COLORS.freshGreen,
    backgroundColor: COLORS.freshGreen,
  },
  summaryCard: {
    padding: SPACING.m,
    backgroundColor: COLORS.white,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.m,
  },
  loyaltyRow: {
    marginBottom: SPACING.m,
  },
  loyaltyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  loyaltyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  loyaltyToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loyaltyLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  totalLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.freshGreen,
  },
  totalNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
});
