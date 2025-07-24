import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/common/Button';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { colors, typography, spacing, borderRadius } from '../theme';

interface RouteParams {
  serverResponse?: string | number;
}

export const ReportPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLanguage();
  const { resetValues, isDevMode } = useData();
  const [displayContent, setDisplayContent] = useState<string | null>(null);

  const { serverResponse } = (route.params as RouteParams) || {};

  const handleResetAndNavigate = () => {
    resetValues();

    // Reset server mode
    const url = `http://ddbackup.lumilynx.co/reset`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Reset data fetched:', data);
      })
      .catch(error => {
        console.error('Error resetting data:', error);
      });

    navigation.navigate('Introduction' as never);
  };

  const handleDisplayReport = () => {
    if (isDevMode) {
      setDisplayContent(t('noAbnormality'));
    } else {
      const responseNumber = Number(serverResponse);
      if (responseNumber >= 25) {
        setDisplayContent(`${t('noAbnormality')}: ${serverResponse}`);
      } else {
        setDisplayContent(t('consultDoctor'));
      }
    }
  };

  const renderReportContent = () => {
    if (!displayContent) return null;

    const isHealthy = displayContent.includes(t('noAbnormality'));

    return (
      <View style={styles.reportContainer}>
        <ScrollView
          style={styles.reportScrollView}
          contentContainerStyle={styles.reportScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[
            styles.reportCard,
            isHealthy ? styles.reportCardHealthy : styles.reportCardWarning
          ]}>
            <View style={styles.reportIconContainer}>
              <Text style={styles.reportIcon}>
                {isHealthy ? '✅' : '⚠️'}
              </Text>
            </View>
            <Text style={[
              styles.reportText,
              isHealthy ? styles.reportTextHealthy : styles.reportTextWarning
            ]}>
              {displayContent}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

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
          <Text style={styles.title}>Analysis Results</Text>
          <Text style={styles.subtitle}>分析結果</Text>
        </View>

        <View style={styles.contentContainer}>
          {renderReportContent()}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t('restartButton')}
            onPress={handleResetAndNavigate}
            variant="outline"
            size="lg"
            style={styles.restartButton}
          />
          <Button
            title={t('displayReportButton')}
            onPress={handleDisplayReport}
            size="lg"
            style={styles.displayButton}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

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
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  reportContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportScrollView: {
    maxHeight: height * 0.4,
    width: '100%',
  },
  reportScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
  },
  reportCardHealthy: {
    borderColor: colors.success,
    backgroundColor: '#F0FDF4',
  },
  reportCardWarning: {
    borderColor: colors.warning,
    backgroundColor: '#FFFBEB',
  },
  reportIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  reportIcon: {
    fontSize: 48,
  },
  reportText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    lineHeight: typography.fontSize.xl * 1.4,
  },
  reportTextHealthy: {
    color: '#166534',
  },
  reportTextWarning: {
    color: '#92400E',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  restartButton: {
    flex: 1,
    marginRight: spacing.md,
    maxWidth: 150,
  },
  displayButton: {
    flex: 1,
    marginLeft: spacing.md,
    maxWidth: 150,
  },
});
