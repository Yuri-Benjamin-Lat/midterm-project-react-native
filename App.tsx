// App.tsx
import 'react-native-get-random-values'; // must be first import for uuid
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './src/context/ThemeContext';
import { SavedJobsProvider } from './src/context/SavedJobsContext';
import AppNavigator from './src/navigation/AppNavigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SavedJobsProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </SavedJobsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}