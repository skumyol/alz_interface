import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/common/Button';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, typography, spacing, borderRadius } from '../theme';

export const InstructionPage: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  const instructions = [
    t('instruction1'),
    t('instruction2'),
    t('instruction3'),
  ];

  return (
    <LinearGradient
      colors={[colors.background, colors.surfaceVariant]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <LanguageToggle />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('instructionsTitle')}</Text>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.instructionsContainer}>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionBullet}>
                    <Text style={styles.instructionNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t('nextButton')}
            onPress={() => navigation.navigate('Record' as never)}
            size="xl"
            circular
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    marginBottom: spacing.xl,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
  },
  scrollContent: {
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  instructionsContainer: {
    paddingVertical: spacing.lg,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  instructionBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  instructionNumber: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  instructionText: {
    flex: 1,
    fontSize: typography.fontSize.xl,
    color: colors.text,
    lineHeight: typography.fontSize.xl * 1.4,
    fontWeight: typography.fontWeight.medium,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
});
