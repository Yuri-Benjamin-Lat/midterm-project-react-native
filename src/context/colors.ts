// context/colors.ts
import { ThemeMode } from './ThemeContext';

// ─── Light Palette ────────────────────────────────────────────────────────────

export const LightColors = {
  text: '#000000',
  background: '#FFFFFF',
  accent: '#F5C518',     // yellow
  accentText: '#000000', // text on yellow buttons
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

// ─── Dark Palette ─────────────────────────────────────────────────────────────

export const DarkColors = {
  text: '#FFFFFF',
  background: '#000000',
  accent: '#F5C518',     // yellow kept same
  accentText: '#000000', // text on yellow buttons
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

// ─── Types + resolver ─────────────────────────────────────────────────────────

export type AppColors = typeof LightColors;

export const getColors = (mode: ThemeMode): AppColors =>
  mode === 'light' ? LightColors : DarkColors;