'use client';

import { useEffect } from 'react';
import { initThemeFromConfig } from '@/lib/theme';

interface ThemeInitializerProps {
  theme?: string;
  customAccent?: string;
}

export function ThemeInitializer({ theme, customAccent }: ThemeInitializerProps) {
  useEffect(() => {
    initThemeFromConfig(theme, customAccent);
  }, [theme, customAccent]);
  return null;
}
