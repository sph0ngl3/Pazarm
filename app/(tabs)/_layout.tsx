import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { ShoppingCart, Package, Home, User } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '@/store/useCartStore';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const TabIcon = ({ icon: Icon, color, focused, size }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(focused ? -2 : 0, { duration: 200, easing: Easing.out(Easing.cubic) }) }],
      opacity: withTiming(focused ? 1 : 0.7, { duration: 200, easing: Easing.out(Easing.cubic) }),
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Icon size={size} color={color} strokeWidth={2.5} />
    </Animated.View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const cartItems = useCartStore(state => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: COLORS.deepBlue,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 10,
          marginTop: -4,
        },
        animation: 'fade',
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Anasayfa',
          tabBarIcon: ({ color, size, focused }) => <TabIcon icon={Home} color={color} size={size} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Ürünler',
          tabBarIcon: ({ color, size, focused }) => <TabIcon icon={Package} color={color} size={size} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Sepet',
          tabBarIcon: ({ color, size, focused }) => <TabIcon icon={ShoppingCart} color={color} size={size} focused={focused} />,
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: COLORS.freshGreen, color: COLORS.white, fontSize: 10 },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => <TabIcon icon={User} color={color} size={size} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
