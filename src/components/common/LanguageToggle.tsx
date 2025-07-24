import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          language === 'en' && styles.activeButton,
        ]}
        onPress={() => handleLanguageChange('en')}
      >
        <Text style={[
          styles.buttonText,
          language === 'en' && styles.activeButtonText,
        ]}>
          EN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          language === 'zh' && styles.activeButton,
        ]}
        onPress={() => handleLanguageChange('zh')}
      >
        <Text style={[
          styles.buttonText,
          language === 'zh' && styles.activeButtonText,
        ]}>
          中文
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: 2,
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minWidth: 50,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  activeButtonText: {
    color: colors.white,
  },
});
