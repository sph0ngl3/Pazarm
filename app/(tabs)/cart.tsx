import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { Card } from '@/components/ui/Card';
import { PazarmHeader } from '@/components/PazarmHeader';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateItemQuantity, removeItem, toggleSubscription, getTotals } = useCartStore();
  const { oneTimeTotalTL, subscriptionTotalTL } = getTotals();

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <PazarmHeader title="Sepetim" />
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <ShoppingCart size={40} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>Sepetiniz boş.</Text>
          <Text style={styles.emptySubtitle}>Ürünler sekmesinden set veya ürün ekleyin.</Text>
          <Button 
            title="Ürünlere Git" 
            onPress={() => router.push('/(tabs)/saved')} 
            style={{ marginTop: SPACING.l }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PazarmHeader title="Sepetim" />

      <ScrollView contentContainerStyle={styles.content}>
        {items.map((item) => (
          <Card key={item.id} style={styles.cartItem}>
            <View style={styles.itemHeader}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.nameTR}</Text>
                <Text style={styles.itemUnit}>{item.unitTR}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
                <Trash2 size={18} color={COLORS.danger} />
              </TouchableOpacity>
            </View>

            <View style={styles.priceRow}>
              <View>
                {item.isSubscription ? (
                  <>
                    <Text style={styles.originalPrice}>{(item.priceTL * 4).toFixed(2)} TL</Text>
                    <Text style={styles.discountPrice}>{(item.priceTL * 0.9 * 4).toFixed(2)} TL</Text>
                    <Text style={styles.discountLabel}>Aylık Toplam (4 Hafta)</Text>
                  </>
                ) : (
                  <Text style={styles.price}>{item.priceTL.toFixed(2)} TL</Text>
                )}
              </View>

              <View style={styles.quantityControl}>
                <TouchableOpacity 
                  style={styles.qtyBtn} 
                  onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={16} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.qtyBtn}
                  onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={16} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {item.type === 'bundle' && (
              <View style={styles.subscriptionContainer}>
                <View style={styles.subHeader}>
                  <Text style={styles.subTitle}>Aylık Abonelik (%10 indirim)</Text>
                  <Switch 
                    value={item.isSubscription} 
                    onValueChange={(val) => toggleSubscription(item.id, val)}
                    trackColor={{ false: "#E2E8F0", true: COLORS.freshGreen }}
                  />
                </View>
                <Text style={styles.subDescription}>1 aylık sözleşme, her hafta teslim.</Text>
              </View>
            )}
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tek Seferlik Toplam:</Text>
          <Text style={styles.summaryValue}>{oneTimeTotalTL.toFixed(2)} TL</Text>
        </View>
        
        {subscriptionTotalTL > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Abonelik Toplamı (Aylık):</Text>
            <Text style={[styles.summaryValue, { color: COLORS.freshGreen }]}>
              {subscriptionTotalTL.toFixed(2)} TL
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <Button 
          title="Ödemeye Geç" 
          onPress={() => router.push('/checkout')} 
          size="large"
        />
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  cartItem: {
    marginBottom: SPACING.m,
    backgroundColor: COLORS.white,
    padding: SPACING.m,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  itemUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  price: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  originalPrice: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.freshGreen,
  },
  discountLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: COLORS.freshGreen,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.s,
    padding: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.s - 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.m,
    minWidth: 20,
    textAlign: 'center',
  },
  subscriptionContainer: {
    backgroundColor: '#F0FDF4',
    padding: SPACING.m,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#166534',
  },
  subDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#15803D',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.m,
  },
});
