import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { Plus, X, Calendar, TrendingUp, Sprout } from 'lucide-react-native';
import { getSeasonalItems, SeasonalItem } from '@/data/seasonal';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';

export const SeasonalSection = () => {
  const items = getSeasonalItems();
  const addItem = useCartStore(state => state.addItem);
  const { showToast } = useToast();
  const router = useRouter();
  
  const [selectedItem, setSelectedItem] = useState<SeasonalItem | null>(null);

  if (items.length === 0) return null;

  const handleAdd = (item: any) => {
    if (item.matchedProduct) {
      addItem({
        refId: item.matchedProduct.id,
        type: 'product',
        nameTR: item.matchedProduct.nameTR,
        unitTR: item.matchedProduct.unitTR,
        priceTL: item.matchedProduct.priceTL,
        quantity: 1,
        imageUrl: item.matchedProduct.imageUrl
      });
      showToast(`Sepete eklendi: ${item.matchedProduct.nameTR}`);
    }
  };

  const handlePress = (item: SeasonalItem) => {
    if (item.matchedProduct) {
      router.push(`/product/${item.matchedProduct.id}`);
    } else {
      // Show details modal for out of stock / info only items
      setSelectedItem(item);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bu Sezon Ne Taze?</Text>
        <Text style={styles.subtitle}>
          Sezonun en taze lezzetleri sizin için seçildi.
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.list}
      >
        {items.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.card}
            onPress={() => handlePress(item)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, item.type === 'MEYVE' ? styles.badgeFruit : styles.badgeVeg]}>
                <Text style={[styles.badgeText, item.type === 'MEYVE' ? styles.textFruit : styles.textVeg]}>
                  {item.type === 'MEYVE' ? 'MEYVE' : 'SEBZE'}
                </Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.name} numberOfLines={1}>{item.nameTR}</Text>
              <Text style={styles.info} numberOfLines={1}>
                {item.matchedProduct ? `${item.matchedProduct.priceTL} TL` : item.monthRange}
              </Text>
            </View>
            
            {item.matchedProduct && (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAdd(item);
                }}
              >
                <Plus size={16} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detail Modal for Out of Stock Items */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedItem(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedItem?.nameTR}</Text>
                  <TouchableOpacity onPress={() => setSelectedItem(null)}>
                    <X size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <Calendar size={20} color={COLORS.freshGreen} />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Tahmini Stok Tarihi</Text>
                    <Text style={styles.infoValue}>{selectedItem?.restockDate}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <TrendingUp size={20} color={COLORS.freshGreen} />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Beklenen Pazar Fiyatı</Text>
                    <Text style={styles.infoValue}>{selectedItem?.priceRange}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <Sprout size={20} color={COLORS.freshGreen} />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Mevsim</Text>
                    <Text style={styles.infoValue}>{selectedItem?.growthMonths}</Text>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <Button 
                    title="Gelince Haber Ver" 
                    onPress={() => {
                        setSelectedItem(null);
                        // Mock notification logic
                    }} 
                    variant="outline"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.m,
    marginBottom: SPACING.m,
  },
  header: {
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  list: {
    paddingHorizontal: SPACING.m,
    gap: SPACING.m,
    paddingBottom: SPACING.s,
  },
  card: {
    width: 130,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.m,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
    backgroundColor: '#F1F5F9',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeFruit: { backgroundColor: '#FEF3C7' },
  badgeVeg: { backgroundColor: '#DCFCE7' },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
  textFruit: { color: '#B45309' },
  textVeg: { color: '#15803D' },
  content: {
    padding: SPACING.s,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  info: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.l,
    padding: SPACING.l,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
    gap: SPACING.m,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  modalFooter: {
    marginTop: SPACING.m,
  },
});
