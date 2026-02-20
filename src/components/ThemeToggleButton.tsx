// components/ThemeToggleButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../context/theme';

interface Props {
  style?: ViewStyle;
}

const ThemeToggleButton: React.FC<Props> = ({ style }) => {
  const { toggleTheme, isDark, mode } = useTheme();
  const colors = getColors(mode);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: colors.accent }, style]}
      activeOpacity={0.8}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      accessibilityRole="button"
    >
      <Text style={styles.icon}>{isDark ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
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
