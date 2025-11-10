'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  JSX,
} from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export function ThemeProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('crypto-tracker-theme') as Theme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme)
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      setThemeState(prefersDark ? 'dark' : 'light')
    }
    setMounted(true)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (mounted) {
      // Add transition class to prevent jarring changes
      document.documentElement.style.transition =
        'background-color 0.3s ease, color 0.3s ease'

      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
      localStorage.setItem('crypto-tracker-theme', theme)

      // Remove transition class after animation completes
      setTimeout(() => {
        document.documentElement.style.transition = ''
      }, 300)
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="dark">{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextProps {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Return a default theme context to prevent errors during SSR/hydration
    return {
      theme: 'dark',
      setTheme: () => {},
      toggleTheme: () => {},
    }
  }
  return context
}
