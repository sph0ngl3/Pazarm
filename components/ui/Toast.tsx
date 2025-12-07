import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';
import { CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const insets = useSafeAreaInsets();

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    
    // Reset values
    fadeAnim.setValue(0);
    translateY.setValue(20);

    // Animate In
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();

    // Hide after delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setMessage(null));
    }, 2000);
  }, [fadeAnim, translateY]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <Animated.View 
          style={[
            styles.toastContainer, 
            { 
              bottom: insets.bottom + 80, // Above tab bar
              opacity: fadeAnim,
              transform: [{ translateY }]
            }
          ]}
        >
          <View style={styles.toastContent}>
            <CheckCircle2 size={20} color={COLORS.white} />
            <Text style={styles.toastText}>{message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'none',
  },
  toastContent: {
    backgroundColor: 'rgba(31, 41, 55, 0.95)', // Dark gray/black
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RADIUS.full,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    color: COLORS.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});
