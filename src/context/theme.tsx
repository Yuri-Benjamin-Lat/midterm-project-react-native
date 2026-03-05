// context/theme.tsx
import { StyleSheet } from 'react-native';
import { AppColors } from './colors';

// Re-export so all existing imports of getColors/AppColors/LightColors/DarkColors
// from theme.tsx continue to work without any changes across the project.
export { getColors, AppColors, LightColors, DarkColors } from './colors';

// ─── Shared style factory ─────────────────────────────────────────────────────

export const makeStyles = (colors: AppColors) =>
  StyleSheet.create({

    // ── Layout ───────────────────────────────────────────────────────────────
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

    // ── Typography ───────────────────────────────────────────────────────────
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

    // ── Cards ────────────────────────────────────────────────────────────────
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // ── Buttons ──────────────────────────────────────────────────────────────
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

    // ── Form ─────────────────────────────────────────────────────────────────
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

    // ── Search ───────────────────────────────────────────────────────────────
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

    // ── Tags ─────────────────────────────────────────────────────────────────
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

    // ── Divider ──────────────────────────────────────────────────────────────
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 10,
    },

    // ── Empty state ───────────────────────────────────────────────────────────
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