import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { User, Bell, Lock, LogOut, Plus, ChevronRight, Map as MapIcon, Info, Coins, Calendar, ShoppingBag, Truck, Handshake, Shield, FileText } from 'lucide-react-native';
import { useStore } from '@/store/useStore';
import { useLoyaltyStore } from '@/store/useLoyaltyStore';
import { useRouter } from 'expo-router';
import { PazarmHeader } from '@/components/PazarmHeader';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const { logout, addresses, user, fetchAddresses } = useStore();
  const { points, fetchPoints } = useLoyaltyStore();
  const router = useRouter();

  useEffect(() => {
    fetchAddresses();
    if (user) {
      fetchPoints(user.id);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <PazarmHeader title="Profil" />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 80 }]}>
        
        {/* M Points Summary (Top) */}
        <TouchableOpacity 
            style={styles.loyaltyCard}
            onPress={() => router.push('/settings/loyalty-info')}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={['#FFFBEB', '#FEF3C7']}
                style={styles.loyaltyGradient}
            >
                <View style={styles.loyaltyHeader}>
                    <View style={styles.coinIconWrapper}>
                        <Coins size={24} color={COLORS.warning} fill={COLORS.warning} />
                    </View>
                    <View>
                        <Text style={styles.loyaltyLabel}>M Puan Bakiyem</Text>
                        <Text style={styles.loyaltyAmount}>{points} TL</Text>
                    </View>
                </View>
                <Text style={styles.loyaltyDesc}>Her 100 TL alışverişinde 1 TL değerinde M Puan kazan.</Text>
            </LinearGradient>
        </TouchableOpacity>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Hesabım</Text>
          <View style={styles.cardGroup}>
            <SettingItem 
              icon={<User size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Profil Ayarları" 
              onPress={() => router.push('/settings/profile')}
            />
            <SettingItem 
              icon={<Truck size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Sipariş Takibi" 
              onPress={() => router.push('/explore/tracking')}
            />
            <SettingItem 
              icon={<Calendar size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Aboneliklerim" 
              onPress={() => router.push('/settings/subscriptions')}
            />
            <SettingItem 
              icon={<Bell size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Bildirimler" 
              onPress={() => router.push('/settings/notifications')}
            />
            <SettingItem 
              icon={<Lock size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Şifre ve Güvenlik" 
              onPress={() => router.push('/settings/security')}
            />
            <SettingItem 
              icon={<LogOut size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Çıkış Yap" 
              onPress={handleLogout} 
              isLast 
            />
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Adreslerim</Text>
          <View style={styles.cardGroup}>
            {addresses.map((addr, index) => (
              <AddressItem 
                key={addr.id}
                type={addr.label || 'Ev'} 
                address={addr.full_address} 
                isLast={index === addresses.length - 1 && false} 
              />
            ))}
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/settings/address/add')}
            >
              <Text style={styles.addButtonText}>Yeni Adres Ekle</Text>
              <View style={styles.addIcon}>
                <Plus size={16} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* More Options */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Diğer Seçenekler</Text>
          <View style={styles.cardGroup}>
            <View style={styles.settingRow}>
               <Text style={styles.settingText}>Sadece Wi-Fi Varken Bağlan</Text>
               <Switch trackColor={{ false: "#767577", true: COLORS.freshGreen }} value={true} />
            </View>
            <SettingItem 
              icon={<MapIcon size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Mahallende Bayilik İçin Başvur" 
              onPress={() => router.push('/settings/partnership')}
            />
            <SettingItem 
              icon={<Handshake size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Pazarm Ortaklık Modeli" 
              onPress={() => router.push('/settings/partnership-model')}
            />
            <SettingItem 
              icon={<Info size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Pazarım Hakkında" 
              onPress={() => router.push('/settings/about')}
            />
            <SettingItem 
              icon={<Shield size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Gizlilik Politikası" 
              onPress={() => router.push('/settings/privacy')}
            />
            <SettingItem 
              icon={<FileText size={20} color={COLORS.white} />} 
              iconBg={COLORS.primaryGradient[0]} 
              title="Kullanım Koşulları" 
              onPress={() => router.push('/settings/terms')}
              isLast
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const SettingItem = ({ icon, iconBg, title, isLast, onPress }: any) => (
  <TouchableOpacity style={[styles.settingItem, isLast && styles.lastItem]} onPress={onPress}>
    <View style={styles.settingLeft}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <Text style={styles.settingText}>{title}</Text>
    </View>
    <ChevronRight size={20} color={COLORS.textSecondary} />
  </TouchableOpacity>
);

const AddressItem = ({ type, address, isLast }: any) => (
  <View style={[styles.addressItem, isLast && styles.lastItem]}>
    <View style={{ flex: 1, marginRight: 10 }}>
      <Text style={styles.addressType}>{type}</Text>
      <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
    </View>
    <ChevronRight size={20} color={COLORS.textSecondary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.l,
  },
  section: {
    marginBottom: SPACING.l, 
  },
  sectionHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: SPACING.m,
    textTransform: 'uppercase',
  },
  loyaltyCard: {
    marginBottom: SPACING.l, 
    borderRadius: RADIUS.m,
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  loyaltyGradient: {
    padding: SPACING.m,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    marginBottom: SPACING.s,
  },
  coinIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loyaltyLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#92400E',
  },
  loyaltyAmount: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#B45309',
  },
  loyaltyDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#92400E',
    opacity: 0.8,
  },
  cardGroup: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.m,
    padding: SPACING.s,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  addressType: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  addressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.m,
    paddingTop: SPACING.s,
  },
  addButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.freshGreen,
  },
  addIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.freshGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
});
