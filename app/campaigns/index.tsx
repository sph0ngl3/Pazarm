import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { fetchActiveCampaigns } from '@/lib/campaigns';
import { Campaign } from '@/types';

export default function CampaignsListScreen() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const data = await fetchActiveCampaigns();
    setCampaigns(data);
    setLoading(false);
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
        <Text style={styles.title}>Kampanyalar</Text>
      </View>

      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/campaigns/${item.id}`)}>
            <Card style={styles.card}>
              <Image source={{ uri: item.image_url || '' }} style={styles.image} />
              <View style={styles.content}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                {item.end_date && (
                    <View style={styles.dateRow}>
                        <Calendar size={14} color={COLORS.textSecondary} />
                        <Text style={styles.dateText}>
                            Son Gün: {new Date(item.end_date).toLocaleDateString('tr-TR')}
                        </Text>
                    </View>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
               <Text style={styles.emptyText}>Şu anda aktif kampanya bulunmuyor.</Text>
            </View>
          ) : null
        }
      />
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
  list: {
    padding: SPACING.m,
    gap: SPACING.m,
  },
  card: {
    padding: 0,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: SPACING.m,
  },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  empty: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
  },
});
