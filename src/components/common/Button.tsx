import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

// Conditional import for expo-linear-gradient to prevent web build issues
let LinearGradient: any = View as any;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  console.warn('expo-linear-gradient not available, using View fallback:', e);
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  circular?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  textStyle,
  circular = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: circular ? borderRadius.full : borderRadius.lg,
      ...shadows.md,
    };

    const sizeStyles = {
      sm: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 36 },
      md: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 44 },
      lg: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, minHeight: 52 },
      xl: { 
        width: circular ? 120 : undefined, 
        height: circular ? 120 : 60, 
        paddingHorizontal: circular ? 0 : spacing.xl, 
        paddingVertical: circular ? 0 : spacing.lg,
        borderRadius: circular ? 60 : borderRadius.lg,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: typography.fontWeight.semibold,
      textAlign: 'center',
    };

    const sizeTextStyles = {
      sm: { fontSize: typography.fontSize.sm },
      md: { fontSize: typography.fontSize.base },
      lg: { fontSize: typography.fontSize.lg },
      xl: { fontSize: typography.fontSize['2xl'] },
    };

    const variantTextStyles = {
      primary: { color: colors.white },
      secondary: { color: colors.white },
      outline: { color: colors.primary },
      ghost: { color: colors.primary },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  const renderButton = () => {
    if (variant === 'primary') {
      return (
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={[getButtonStyle(), style]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </LinearGradient>
      );
    }

    const variantStyles = {
      secondary: { backgroundColor: colors.secondary },
      outline: { 
        backgroundColor: 'transparent', 
        borderWidth: 2, 
        borderColor: colors.primary 
      },
      ghost: { backgroundColor: 'transparent' },
    };

    return (
      <TouchableOpacity
        style={[getButtonStyle(), variantStyles[variant], style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {renderButton()}
      </TouchableOpacity>
    );
  }

  return renderButton();
};
