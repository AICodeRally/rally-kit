'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'
type FontSize = 'sm' | 'md' | 'lg'

const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: '14px',
  md: '16px',
  lg: '18px',
}

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  fontSize: FontSize
  cycleFontSize: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  fontSize: 'md',
  cycleFontSize: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [fontSize, setFontSize] = useState<FontSize>('md')

  useEffect(() => {
    const storedTheme = localStorage.getItem('rally-theme') as Theme | null
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
      document.documentElement.dataset.theme = storedTheme
    }
    const storedSize = localStorage.getItem('rally-font-size') as FontSize | null
    if (storedSize && storedSize in FONT_SIZE_MAP) {
      setFontSize(storedSize)
      document.documentElement.style.fontSize = FONT_SIZE_MAP[storedSize]
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('rally-theme', next)
      document.documentElement.dataset.theme = next
      return next
    })
  }, [])

  const cycleFontSize = useCallback(() => {
    setFontSize((prev) => {
      const order: FontSize[] = ['sm', 'md', 'lg']
      const idx = order.indexOf(prev)
      const next = order[(idx + 1) % order.length]
      localStorage.setItem('rally-font-size', next)
      document.documentElement.style.fontSize = FONT_SIZE_MAP[next]
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, cycleFontSize }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
