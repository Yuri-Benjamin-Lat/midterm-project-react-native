// context/theme.tsx
import { StyleSheet } from 'react-native';
import { ThemeMode } from './ThemeContext';

// ─── Color Palettes ───────────────────────────────────────────────────────────

export const LightColors = {
  text: '#000000',
  background: '#FFFFFF',
  accent: '#F5C518',      // yellow
  accentText: '#000000',  // text on yellow buttons
  card: '#F8F8F8',
  border: '#E0E0E0',
  subText: '#666666',
  error: '#D32F2F',
  placeholder: '#999999',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E0E0E0',
  headerBg: '#FFFFFF',
  searchBg: '#F0F0F0',
  tagBg: '#EEEEEE',
  tagText: '#444444',
  successBg: '#E8F5E9',
  successText: '#2E7D32',
};

export const DarkColors = {
  text: '#FFFFFF',
  background: '#000000',
  accent: '#F5C518',      // yellow kept same
  accentText: '#000000',  // text on yellow buttons
  card: '#1A1A1A',
  border: '#333333',
  subText: '#AAAAAA',
  error: '#EF9A9A',
  placeholder: '#777777',
  tabBar: '#111111',
  tabBarBorder: '#333333',
  headerBg: '#111111',
  searchBg: '#1E1E1E',
  tagBg: '#2A2A2A',
  tagText: '#CCCCCC',
  successBg: '#1B3A1F',
  successText: '#81C784',
};

export type AppColors = typeof LightColors;

export const getColors = (mode: ThemeMode): AppColors =>
  mode === 'light' ? LightColors : DarkColors;

// ─── Shared style factory ─────────────────────────────────────────────────────

export const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    // Layout
    flex1: { flex: 1 },
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },

    // Typography
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    subtitle: {
      fontSize: 15,
      color: colors.subText,
      marginTop: 2,
    },
    bodyText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 2,
      marginBottom: 4,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.subText,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 6,
    },

    // Cards
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Buttons
    accentButton: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    accentButtonText: {
      color: colors.accentText,
      fontWeight: '700',
      fontSize: 14,
    },
    outlineButton: {
      borderWidth: 1.5,
      borderColor: colors.accent,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    outlineButtonText: {
      color: colors.accent,
      fontWeight: '700',
      fontSize: 14,
    },
    dangerButton: {
      backgroundColor: colors.error,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dangerButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 14,
    },

    // Form
    inputContainer: {
      marginBottom: 14,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.searchBg,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputError: {
      borderColor: colors.error,
    },
    textArea: {
      height: 110,
      textAlignVertical: 'top',
    },

    // Search
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.searchBg,
      borderRadius: 10,
      marginHorizontal: 16,
      marginVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      paddingVertical: 10,
      marginLeft: 8,
    },

    // Tags
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      gap: 6,
    },
    tag: {
      backgroundColor: colors.tagBg,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    tagText: {
      fontSize: 12,
      color: colors.tagText,
    },

    // Divider
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 10,
    },

    // Empty state
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    emptyText: {
      fontSize: 16,
      color: colors.subText,
      textAlign: 'center',
      marginTop: 12,
    },
  });
