import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DataProvider } from './src/contexts/DataContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { injectWebStyles } from './src/theme/webStyles';

export default function App() {
  useEffect(() => {
    // Inject web-specific styles for better mobile experience
    if (Platform.OS === 'web') {
      injectWebStyles();
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DataProvider>
          <LanguageProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </LanguageProvider>
        </DataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
