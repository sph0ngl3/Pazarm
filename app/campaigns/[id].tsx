import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { fetchCampaignById } from '@/lib/campaigns';
import { Campaign } from '@/types';

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (id) {
      loadCampaign();
    }
  }, [id]);

  const loadCampaign = async () => {
    const data = await fetchCampaignById(id);
    setCampaign(data);
  };

  if (!campaign) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: campaign.image_url || '' }} style={styles.image} />
          <SafeAreaView style={styles.header} edges={['top']}>
            <Button 
              title="" 
              icon={<ArrowLeft size={24} color={COLORS.textPrimary} />} 
              onPress={() => router.back()} 
              variant="ghost"
              style={styles.backButton}
            />
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{campaign.title}</Text>
          
          {campaign.end_date && (
            <View style={styles.dateBadge}>
                <Calendar size={14} color={COLORS.freshGreen} />
                <Text style={styles.dateText}>
                    Son Gün: {new Date(campaign.end_date).toLocaleDateString('tr-TR')}
                </Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>{campaign.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Alışverişe Başla" onPress={() => router.push('/(tabs)/saved')} size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButton: {
    marginLeft: SPACING.s,
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.l,
    marginTop: -24,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 6,
  },
  dateText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.freshGreen,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.l,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
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
