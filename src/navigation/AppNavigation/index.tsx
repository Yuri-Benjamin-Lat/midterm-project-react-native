// navigation/AppNavigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../context/theme';

import HomeScreen from '../../pages/Home';
import SavedScreen from '../../pages/Saved';
import FormScreen from '../../pages/Form';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { mode } = useTheme();
  const colors = getColors(mode);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name="Form" component={FormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;