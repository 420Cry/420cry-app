'use client'

import { useEffect, type ReactNode } from 'react'
import { theme } from '@420cry/420cry-lib'

/**
 * ThemeProvider Component
 * Injects theme CSS variables into the document root
 */
export function ThemeProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  useEffect(() => {
    const root = document.documentElement

    // Inject theme colors as CSS variables
    Object.entries(theme.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--theme-primary-${key}`, value as string)
    })

    Object.entries(theme.colors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--theme-secondary-${key}`, value as string)
    })

    Object.entries(theme.colors.success).forEach(([key, value]) => {
      root.style.setProperty(`--theme-success-${key}`, value as string)
    })

    Object.entries(theme.colors.warning).forEach(([key, value]) => {
      root.style.setProperty(`--theme-warning-${key}`, value as string)
    })

    Object.entries(theme.colors.danger).forEach(([key, value]) => {
      root.style.setProperty(`--theme-danger-${key}`, value as string)
    })

    Object.entries(theme.colors.gray).forEach(([key, value]) => {
      root.style.setProperty(`--theme-gray-${key}`, value as string)
    })

    // Inject spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--theme-spacing-${key}`, value as string)
    })

    Object.entries(theme.spacingScale).forEach(([key, value]) => {
      root.style.setProperty(`--theme-spacing-${key}`, value as string)
    })

    // Inject breakpoints
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      root.style.setProperty(`--theme-breakpoint-${key}`, value as string)
    })

    // Inject font sizes
    Object.entries(theme.fontSizes).forEach(([key, value]) => {
      root.style.setProperty(`--theme-font-size-${key}`, value.size)
      root.style.setProperty(`--theme-line-height-${key}`, value.lineHeight)
    })

    // Inject font weights
    Object.entries(theme.fontWeights).forEach(([key, value]) => {
      root.style.setProperty(`--theme-font-weight-${key}`, value)
    })

    // Inject shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--theme-shadow-${key}`, value as string)
    })

    // Inject border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--theme-radius-${key}`, value as string)
    })
  }, [])

  return <>{children}</>
}
