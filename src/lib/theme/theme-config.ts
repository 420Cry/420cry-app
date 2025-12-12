/**
 * Theme Configuration
 * Maps the 420cry-lib theme system to CSS variables for use in the app
 */

import { theme } from '@420cry/420cry-lib'

/**
 * Generate CSS variables from theme
 * This can be used to inject theme values as CSS variables
 */
export function generateThemeCSSVariables(): string {
  const variables: string[] = []

  // Colors - Primary
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    variables.push(`  --theme-primary-${key}: ${value};`)
  })

  // Colors - Secondary
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    variables.push(`  --theme-secondary-${key}: ${value};`)
  })

  // Colors - Success
  Object.entries(theme.colors.success).forEach(([key, value]) => {
    variables.push(`  --theme-success-${key}: ${value};`)
  })

  // Colors - Warning
  Object.entries(theme.colors.warning).forEach(([key, value]) => {
    variables.push(`  --theme-warning-${key}: ${value};`)
  })

  // Colors - Danger
  Object.entries(theme.colors.danger).forEach(([key, value]) => {
    variables.push(`  --theme-danger-${key}: ${value};`)
  })

  // Colors - Gray
  Object.entries(theme.colors.gray).forEach(([key, value]) => {
    variables.push(`  --theme-gray-${key}: ${value};`)
  })

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables.push(`  --theme-spacing-${key}: ${value};`)
  })

  // Spacing Scale
  Object.entries(theme.spacingScale).forEach(([key, value]) => {
    variables.push(`  --theme-spacing-${key}: ${value};`)
  })

  // Breakpoints
  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    variables.push(`  --theme-breakpoint-${key}: ${value};`)
  })

  // Font Sizes
  Object.entries(theme.fontSizes).forEach(([key, value]) => {
    variables.push(`  --theme-font-size-${key}: ${value.size};`)
    variables.push(`  --theme-line-height-${key}: ${value.lineHeight};`)
  })

  // Font Weights
  Object.entries(theme.fontWeights).forEach(([key, value]) => {
    variables.push(`  --theme-font-weight-${key}: ${value};`)
  })

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables.push(`  --theme-shadow-${key}: ${value};`)
  })

  // Border Radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables.push(`  --theme-radius-${key}: ${value};`)
  })

  return `:root {\n${variables.join('\n')}\n}`
}

/**
 * Get theme color value
 */
export function getThemeColor(
  colorName:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'gray',
  scale = 'DEFAULT',
): string {
  const color = theme.colors[colorName]
  if (typeof color === 'string') {
    return color
  }
  return color[scale as keyof typeof color] || color.DEFAULT
}

/**
 * Get theme spacing value
 */
export function getThemeSpacing(key: string): string {
  if (key in theme.spacing) {
    const spacingKey = Number(key) as keyof typeof theme.spacing
    return theme.spacing[spacingKey] || theme.spacing[4]
  }
  if (key in theme.spacingScale) {
    return theme.spacingScale[key as keyof typeof theme.spacingScale]
  }
  return theme.spacing[4] // Default to 1rem
}

/**
 * Theme color mappings for component CSS variables
 */
export const themeColorMap = {
  // Button colors using theme
  buttonDefaultBg: getThemeColor('gray', '50'),
  buttonDefaultText: getThemeColor('gray', '800'),
  buttonDefaultBorder: getThemeColor('gray', '300'),
  buttonDefaultHover: getThemeColor('gray', '100'),
  buttonDefaultRing: getThemeColor('gray', '300'),

  buttonOutlineBorder: getThemeColor('gray', '300'),
  buttonOutlineText: getThemeColor('gray', '800'),
  buttonOutlineHoverBg: getThemeColor('gray', '100'),
  buttonOutlineHoverText: getThemeColor('gray', '800'),

  buttonTextText: getThemeColor('gray', '800'),
  buttonTextHover: getThemeColor('gray', '100'),

  // Badge colors
  badgeBg: getThemeColor('gray', '100'),
  badgeText: getThemeColor('gray', '800'),
  badgeRing: getThemeColor('gray', '300'),

  // Input colors
  inputBg: theme.colors.white,
  inputText: getThemeColor('gray', '800'),
  inputBorder: getThemeColor('gray', '300'),
  inputPlaceholder: getThemeColor('gray', '400'),
  inputFocusBorder: getThemeColor('primary', '500'),
  inputFocusRing: getThemeColor('primary', '500'),

  // Card colors
  cardBorder: getThemeColor('gray', '300'),
  cardBgLight: theme.colors.white,
  cardBgDark: getThemeColor('gray', '800'),
  cardIcon: getThemeColor('gray', '500'),
  cardHover: getThemeColor('gray', '100'),
  cardRing: getThemeColor('gray', '500'),

  // Dark theme overrides
  darkButtonDefaultBg: getThemeColor('gray', '800'),
  darkButtonDefaultText: theme.colors.white,
  darkButtonDefaultBorder: getThemeColor('gray', '700'),
  darkButtonDefaultHover: getThemeColor('gray', '700'),
  darkButtonDefaultRing: getThemeColor('gray', '700'),

  darkButtonOutlineBorder: getThemeColor('gray', '600'),
  darkButtonOutlineText: theme.colors.white,
  darkButtonOutlineHoverBg: getThemeColor('gray', '700'),
  darkButtonOutlineHoverText: theme.colors.white,

  darkButtonTextText: theme.colors.white,
  darkButtonTextHover: getThemeColor('gray', '700'),

  darkBadgeBg: getThemeColor('gray', '700'),
  darkBadgeText: theme.colors.white,
  darkBadgeRing: getThemeColor('gray', '600'),

  darkInputBg: getThemeColor('gray', '700'),
  darkInputText: theme.colors.white,
  darkInputBorder: getThemeColor('gray', '600'),
  darkInputPlaceholder: getThemeColor('gray', '400'),
  darkInputFocusBorder: getThemeColor('primary', '400'),
  darkInputFocusRing: getThemeColor('primary', '400'),

  darkCardBorder: getThemeColor('gray', '600'),
  darkCardBgLight: theme.colors.white,
  darkCardBgDark: getThemeColor('gray', '800'),
  darkCardIcon: getThemeColor('gray', '400'),
  darkCardHover: getThemeColor('gray', '700'),
  darkCardRing: getThemeColor('gray', '600'),

  // Neon theme colors (using theme colors)
  neonPrimary: getThemeColor('secondary', '600'), // #9333ea
  neonSecondary: getThemeColor('primary', '500'), // #0ea5e9
  neonAccent: '#22d3ee', // cyan-400 (can be added to theme later)
} as const
