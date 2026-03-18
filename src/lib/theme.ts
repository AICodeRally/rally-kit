// src/lib/theme.ts

export type ThemeName = 'ocean' | 'sunset' | 'forest' | 'berry' | 'slate' | 'custom';

export interface ThemeColors {
  accent: string;
  accentLight: string;
  accentDark: string;
  secondary: string;
  tertiary: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
}

export const themes: Record<ThemeName, Theme> = {
  ocean: {
    name: 'ocean',
    label: 'Ocean',
    colors: {
      accent: '#0ea5e9',
      accentLight: '#38bdf8',
      accentDark: '#0284c7',
      secondary: '#06b6d4',
      tertiary: '#8b5cf6',
    },
  },
  sunset: {
    name: 'sunset',
    label: 'Sunset',
    colors: {
      accent: '#f97316',
      accentLight: '#fb923c',
      accentDark: '#ea580c',
      secondary: '#eab308',
      tertiary: '#ef4444',
    },
  },
  forest: {
    name: 'forest',
    label: 'Forest',
    colors: {
      accent: '#22c55e',
      accentLight: '#4ade80',
      accentDark: '#16a34a',
      secondary: '#14b8a6',
      tertiary: '#84cc16',
    },
  },
  berry: {
    name: 'berry',
    label: 'Berry',
    colors: {
      accent: '#a855f7',
      accentLight: '#c084fc',
      accentDark: '#9333ea',
      secondary: '#ec4899',
      tertiary: '#6366f1',
    },
  },
  slate: {
    name: 'slate',
    label: 'Slate',
    colors: {
      accent: '#64748b',
      accentLight: '#94a3b8',
      accentDark: '#475569',
      secondary: '#0ea5e9',
      tertiary: '#8b5cf6',
    },
  },
  custom: {
    name: 'custom',
    label: 'Custom',
    colors: {
      accent: '#0ea5e9',
      accentLight: '#38bdf8',
      accentDark: '#0284c7',
      secondary: '#06b6d4',
      tertiary: '#8b5cf6',
    },
  },
};

export function applyTheme(themeName: ThemeName, customAccent?: string): void {
  const theme = themes[themeName];
  const colors = themeName === 'custom' && customAccent
    ? { ...theme.colors, accent: customAccent }
    : theme.colors;

  const root = document.documentElement;
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-light', colors.accentLight);
  root.style.setProperty('--color-accent-dark', colors.accentDark);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-tertiary', colors.tertiary);
}

export function initThemeFromConfig(themeName?: string, customAccent?: string): void {
  const name = (themeName as ThemeName) || 'ocean';
  applyTheme(name, customAccent);
}
