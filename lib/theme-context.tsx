'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'retro'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const CYCLE: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'retro',
  retro: 'light',
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  // Sync with what the inline script already set
  useEffect(() => {
    const stored = localStorage.getItem('waxe-theme') as Theme | null
    if (stored === 'light' || stored === 'dark' || stored === 'retro') {
      setTheme(stored)
    }
  }, [])

  const toggleTheme = () => {
    const next = CYCLE[theme]
    setTheme(next)
    localStorage.setItem('waxe-theme', next)
    document.documentElement.classList.remove('dark', 'light', 'retro')
    document.documentElement.classList.add(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
