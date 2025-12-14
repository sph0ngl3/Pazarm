import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Apple, Chrome, Phone } from 'lucide-react-native';
import { useStore } from '@/store/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const LOGO_WITH_TEXT = 'https://i.ibb.co/d0JPqzR6/logo.png';

export default function GetStartedScreen() {
  const router = useRouter();
  const login = useStore((state) => state.login);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    setLoading(true);
    // Mock login with phone
    const userPhone = phoneNumber || '5551234567';
    await login(userPhone, 'Ahmet Erener');
    setLoading(false);
    router.replace('/(tabs)/explore');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.topSection}>
            <LinearGradient
              colors={['#E0F7FA', '#FFFFFF']}
              style={styles.backgroundGradient}
            />
            <View style={styles.logoContainer}>
               <Image 
                 source={{ uri: LOGO_WITH_TEXT }} 
                 style={styles.logoImage} 
                 resizeMode="contain"
               />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.textSection}>
              <Text style={styles.headline}>
                Pazar Kadar Taze,{'\n'}Market Kadar Hızlı.
              </Text>
              <Text style={styles.subtext}>
                Mahallenin pazarı artık kapında. En taze ürünler, tek paket halinde, en uygun fiyatlarla.
              </Text>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.phoneInputContainer}>
                <Phone size={20} color={COLORS.textSecondary} style={styles.phoneIcon} />
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Telefon Numarası (5XX...)"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              
              <Button 
                title="Telefon ile Devam Et" 
                onPress={handleLogin}
                loading={loading}
                style={styles.mainButton}
              />
            </View>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialSection}>
              <Button 
                title="Apple ile Devam Et" 
                onPress={handleLogin}
                variant="secondary"
                icon={<Apple size={20} color={COLORS.textPrimary} />}
                style={styles.socialButton}
              />
              <Button 
                title="Google ile Devam Et" 
                onPress={handleLogin}
                variant="outline"
                icon={<Chrome size={20} color={COLORS.textPrimary} />}
                style={styles.socialButton}
              />
            </View>
            
            <Text style={styles.disclaimer}>
              Devam ederek Gizlilik ve Kullanıcı sözleşmesini kabul etmiş sayılırsın.
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  topSection: {
    height: height * 0.35,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.l,
  },
  logoImage: {
    width: 200,
    height: 80,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    padding: SPACING.l,
    paddingBottom: SPACING.xl,
    justifyContent: 'flex-start',
  },
  textSection: {
    marginTop: SPACING.m,
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  headline: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.s,
    lineHeight: 32,
  },
  subtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.s,
  },
  inputSection: {
    marginBottom: SPACING.m,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.m,
    height: 50,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  phoneIcon: {
    marginRight: SPACING.s,
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    height: '100%',
  },
  mainButton: {
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: SPACING.m,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  socialSection: {
    gap: SPACING.s,
  },
  socialButton: {
    width: '100%',
  },
  disclaimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.m,
    opacity: 0.7,
    marginBottom: SPACING.l,
  },
});
