import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button } from '../components/common/Button';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { colors, typography, spacing, borderRadius } from '../theme';

export const LandingPage: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { isDevMode, setIsDevMode } = useData();
  const [mode, setMode] = useState('normal');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Mode 1', value: 'reset' },
    { label: 'Mode 2', value: 'alwayshealthy' },
    { label: 'Mode 3', value: 'alwaysmci' }
  ]);

  const handleToggleSwitch = () => setIsDevMode(previousState => !previousState);

  const handleModeChange = (newMode: string | null) => {
    if (newMode) {
      setMode(newMode);
      const url = `http://ddbackup.lumilynx.co/${newMode}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log('Data fetched:', data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  };

  const fetchCurrentMode = () => {
    const url = `http://ddbackup.lumilynx.co/mode`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setMode(data.mode);
        console.log('Current mode fetched:', data.mode);
      })
      .catch(error => {
        console.error('Error fetching current mode:', error);
      });
  };

  useEffect(() => {
    fetchCurrentMode();
  }, []);

  return (
    <LinearGradient
      colors={[colors.background, colors.surfaceVariant]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <LanguageToggle />
        </View>

        <View style={styles.devContainer}>
          <View style={styles.devModeContainer}>
            <Text style={styles.devModeText}>{t('devMode')}</Text>
            <Switch
              onValueChange={handleToggleSwitch}
              value={isDevMode}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={isDevMode ? colors.primary : colors.textLight}
              style={styles.switch}
            />
          </View>

          <View style={styles.modeSelectorContainer}>
            <Text style={styles.modeSelectorText}>{t('selectMode')}</Text>
            <DropDownPicker
              open={open}
              value={mode}
              items={items}
              setOpen={setOpen}
              setValue={setMode}
              setItems={setItems}
              onChangeValue={handleModeChange}
              style={styles.picker}
              dropDownContainerStyle={styles.dropDownContainer}
              textStyle={styles.pickerText}
              placeholderStyle={styles.pickerPlaceholder}
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            {t('mainTitle')}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t('startButton')}
            onPress={() => navigation.navigate('Instructions' as never)}
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
  devContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  devModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  devModeText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginRight: spacing.md,
  },
  switch: {
    transform: Platform.OS === 'ios' ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [],
  },
  modeSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  modeSelectorText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginRight: spacing.sm,
  },
  picker: {
    flex: 1,
    minHeight: 40,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  dropDownContainer: {
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  pickerText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  pickerPlaceholder: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  mainTitle: {
    fontSize: Math.min(typography.fontSize['5xl'], width * 0.08),
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    lineHeight: Math.min(typography.fontSize['5xl'], width * 0.08) * 1.2,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
});
