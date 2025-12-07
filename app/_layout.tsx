import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ToastProvider } from '@/components/ui/Toast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <View />;
  }

  return (
    <ToastProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false, 
          animation: 'slide_from_right', // Smooth slide transition
          animationDuration: 350,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          contentStyle: { backgroundColor: '#FFFFFF' },
          presentation: 'card',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade', animationDuration: 250 }} />
        <Stack.Screen name="order-confirmed" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="settings/loyalty-info" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
      <StatusBar style="dark" />
    </ToastProvider>
  );
}
