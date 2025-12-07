import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  loading,
  style,
  textStyle,
  disabled,
}) => {
  const isPrimary = variant === 'primary';
  
  const content = (
    <ViewStyleWrapper 
      style={[
        styles.base, 
        styles[size], 
        !isPrimary && styles[variant],
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.textPrimary} />
      ) : (
        <>
          {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
          <Text style={[
            styles.text, 
            styles[`text_${size}`],
            !isPrimary && styles.textSecondary,
            textStyle
          ]}>
            {title}
          </Text>
        </>
      )}
    </ViewStyleWrapper>
  );

  if (isPrimary && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, styles[size], style]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              {icon}
              <Text style={[styles.text, styles[`text_${size}`], { color: COLORS.white }, icon ? { marginLeft: 8 } : {}]}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
};

// Helper component to avoid TS issues with LinearGradient vs View
const ViewStyleWrapper = ({ children, style }: { children: React.ReactNode, style: any }) => {
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  // Variants (Non-gradient)
  secondary: {
    backgroundColor: COLORS.card,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#E2E8F0',
  },
  // Text Styles
  text: {
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  text_small: {
    fontSize: 12,
  },
  text_medium: {
    fontSize: 14,
  },
  text_large: {
    fontSize: 16,
  },
  textSecondary: {
    color: COLORS.textPrimary,
  },
});
