// components/ThemeToggleButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { useAppStyles } from '../hooks/useAppStyles';

interface Props {
  style?: ViewStyle;
}

const ThemeToggleButton: React.FC<Props> = ({ style }) => {
  const { toggleTheme, isDark } = useTheme();
  const { colors } = useAppStyles();

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.accent, opacity: pressed ? 0.7 : 1 },
        style,
      ]}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      accessibilityRole="button"
    >
      <Text style={styles.icon}>{isDark ? '☀️' : '🌙'}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  icon: {
    fontSize: 18,
  },
});

export default ThemeToggleButton;