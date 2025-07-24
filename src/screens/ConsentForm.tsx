import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/common/Button';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, typography, spacing, borderRadius } from '../theme';

export const ConsentForm: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [accepted, setAccepted] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    checkIfContentFitsScreen();
  }, [scrollViewHeight, contentHeight]);

  const checkIfContentFitsScreen = () => {
    if (contentHeight <= scrollViewHeight) {
      setAccepted(true);
    }
  };

  const handleAccept = () => {
    if (Platform.OS === 'web') {
      // For web, show a simple confirmation
      const confirmed = window.confirm(`${t('confirmationTitle')}\n${t('confirmationMessage')}`);
      if (confirmed) {
        navigation.navigate('Contact' as never);
      } else {
        navigation.navigate('Welcome' as never);
      }
    } else {
      Alert.alert(
        t('confirmationTitle'),
        t('confirmationMessage'),
        [
          {
            text: t('no'),
            onPress: () => navigation.navigate('Welcome' as never),
            style: 'cancel',
          },
          {
            text: t('yes'),
            onPress: () => navigation.navigate('Contact' as never),
          },
        ]
      );
    }
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

        <View style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <Image
              source={require('../../assets/hkust_logo.png')}
              style={styles.hkustLogo}
              resizeMode="contain"
            />
            <Image
              source={require('../../assets/centerofaging_logo.png')}
              style={styles.centerLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('welcomeTitle')}</Text>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            onContentSizeChange={(contentWidth, contentHeight) => {
              setContentHeight(contentHeight);
            }}
            onLayout={({ nativeEvent }) => {
              setScrollViewHeight(nativeEvent.layout.height);
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.messageContainer}>
              <Text style={styles.proceedMessage}>
                {t('proceedMessage')}
              </Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t('continueButton')}
            onPress={handleAccept}
            disabled={!accepted}
            size="xl"
            circular
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hkustLogo: {
    height: 80,
    width: 120,
    marginRight: spacing.md,
  },
  centerLogo: {
    height: 80,
    width: 100,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    lineHeight: typography.fontSize['3xl'] * 1.2,
  },
  contentContainer: {
    flex: 1,
    marginBottom: spacing.xl,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
    minHeight: '100%',
    justifyContent: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedMessage: {
    fontSize: typography.fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
});
