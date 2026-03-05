// hooks/useAppStyles.ts
import { useMemo } from 'react';

import { useTheme } from '../context/ThemeContext';
import { getColors, makeStyles } from '../context/theme';

/**
 * Returns memoized theme colors and shared styles.
 * Recalculates only when the theme mode changes — not on every render.
 *
 * Usage:
 *   const { colors, shared } = useAppStyles();
 */
export const useAppStyles = () => {
  const { mode } = useTheme();

  const colors = useMemo(() => getColors(mode), [mode]);
  const shared = useMemo(() => makeStyles(colors), [colors]);

  return { colors, shared, mode };
};