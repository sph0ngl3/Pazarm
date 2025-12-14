import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { Plus, X, Calendar, TrendingUp, Sprout } from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';

// Extended type for UI
interface SeasonalItemUI extends Product {
  current_price: number;
}

export const SeasonalSection = () => {
  const addItem = useCartStore(state => state.addItem);
  const { showToast } = useToast();
  const router = useRouter();
  
  const [items, setItems] = useState<SeasonalItemUI[]>([]);
  const [selectedItem, setSelectedItem] = useState<SeasonalItemUI | null>(null);

  useEffect(() => {
    fetchSeasonalItems();
  }, []);

  const fetchSeasonalItems = async () => {
    // Fetch products marked as seasonal
    // Also join market_products to get a price (just taking first available price for display)
    const { data } = await supabase
      .from('products')
      .select('*, market_products(current_price)')
      .eq('is_seasonal', true)
      .limit(10);
      
    if (data) {
      const formatted = data.map((p: any) => ({
        ...p,
        current_price: p.market_products?.[0]?.current_price || 0
      }));
      setItems(formatted);
    }
  };

  if (items.length === 0) return null;

  const handleAdd = (item: SeasonalItemUI) => {
    addItem({
      refId: item.id,
      type: 'product',
      nameTR: item.name,
      unitTR: item.unit,
      priceTL: item.current_price,
      quantity: 1,
      imageUrl: item.image_url || ''
    });
    showToast(`Sepete eklendi: ${item.name}`);
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
        {items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.card}
            onPress={() => router.push(`/product/${item.id}`)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.image_url || '' }} style={styles.image} />
            
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, styles.badgeVeg]}>
                <Text style={[styles.badgeText, styles.textVeg]}>
                  SEZON
                </Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.info} numberOfLines={1}>
                {item.current_price > 0 ? `${item.current_price} TL` : 'Tükendi'}
              </Text>
            </View>
            
            {item.current_price > 0 && (
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
  badgeVeg: { backgroundColor: '#DCFCE7' },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
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
});
