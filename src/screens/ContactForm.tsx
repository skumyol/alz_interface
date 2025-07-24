import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { colors, typography, spacing, borderRadius } from '../theme';

export const ContactForm: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { name, email, setName, setEmail } = useData();
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNextPress = () => {
    let hasError = false;

    // Reset errors
    setNameError('');
    setEmailError('');

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError(t('invalidEmail'));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    navigation.navigate('Welcome' as never);
  };

  const canGoNext = name.trim() !== '' && email.trim() !== '' && validateEmail(email);

  return (
    <LinearGradient
      colors={[colors.background, colors.surfaceVariant]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <LanguageToggle />
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Contact Information</Text>
              <Text style={styles.subtitle}>
                Please provide your details to continue
              </Text>
            </View>

            <View style={styles.formContainer}>
              <Input
                label="Name / 姓名"
                placeholder={t('namePlaceholder')}
                value={name}
                onChangeText={setName}
                error={nameError}
                containerStyle={styles.inputContainer}
              />

              <Input
                label="Email / 電子郵件"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.inputContainer}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title={t('nextButton')}
                onPress={handleNextPress}
                disabled={!canGoNext}
                size="lg"
                style={styles.nextButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  nextButton: {
    minWidth: 200,
  },
});
