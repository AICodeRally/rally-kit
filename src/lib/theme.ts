// src/lib/theme.ts

export type ThemeName = 'ocean' | 'sunset' | 'forest' | 'berry' | 'slate' | 'neon' | 'lava' | 'midnight' | 'rose' | 'arctic' | 'gold' | 'mocha' | 'coral' | 'mono' | 'custom';

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
  neon: {
    name: 'neon',
    label: 'Neon',
    colors: {
      accent: '#22d3ee',
      accentLight: '#67e8f9',
      accentDark: '#06b6d4',
      secondary: '#a3e635',
      tertiary: '#f472b6',
    },
  },
  lava: {
    name: 'lava',
    label: 'Lava',
    colors: {
      accent: '#ef4444',
      accentLight: '#f87171',
      accentDark: '#dc2626',
      secondary: '#f97316',
      tertiary: '#eab308',
    },
  },
  midnight: {
    name: 'midnight',
    label: 'Midnight',
    colors: {
      accent: '#6366f1',
      accentLight: '#818cf8',
      accentDark: '#4f46e5',
      secondary: '#8b5cf6',
      tertiary: '#06b6d4',
    },
  },
  rose: {
    name: 'rose',
    label: 'Rose',
    colors: {
      accent: '#f43f5e',
      accentLight: '#fb7185',
      accentDark: '#e11d48',
      secondary: '#fb7185',
      tertiary: '#fda4af',
    },
  },
  arctic: {
    name: 'arctic',
    label: 'Arctic',
    colors: {
      accent: '#38bdf8',
      accentLight: '#7dd3fc',
      accentDark: '#0ea5e9',
      secondary: '#e0f2fe',
      tertiary: '#7dd3fc',
    },
  },
  gold: {
    name: 'gold',
    label: 'Gold',
    colors: {
      accent: '#eab308',
      accentLight: '#fbbf24',
      accentDark: '#ca8a04',
      secondary: '#ca8a04',
      tertiary: '#fbbf24',
    },
  },
  mocha: {
    name: 'mocha',
    label: 'Mocha',
    colors: {
      accent: '#92400e',
      accentLight: '#b45309',
      accentDark: '#78350f',
      secondary: '#b45309',
      tertiary: '#d97706',
    },
  },
  coral: {
    name: 'coral',
    label: 'Coral',
    colors: {
      accent: '#fb923c',
      accentLight: '#fdba74',
      accentDark: '#f97316',
      secondary: '#f87171',
      tertiary: '#fbbf24',
    },
  },
  mono: {
    name: 'mono',
    label: 'Mono',
    colors: {
      accent: '#ffffff',
      accentLight: '#e4e4e7',
      accentDark: '#d4d4d8',
      secondary: '#a1a1aa',
      tertiary: '#71717a',
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
