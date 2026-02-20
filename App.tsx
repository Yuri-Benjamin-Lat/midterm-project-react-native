// App.tsx
import 'react-native-get-random-values'; // must be first import for uuid
import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SavedJobsProvider } from './context/SavedJobsContext';
import AppNavigator from './navigation/AppNavigation';

// Inner component so it can access ThemeContext
const InnerApp: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <SavedJobsProvider>
        <InnerApp />
      </SavedJobsProvider>
    </ThemeProvider>
  );
}
