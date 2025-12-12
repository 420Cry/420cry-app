/**
 * Theme Classes Utility
 * Helper functions to generate theme-based Tailwind classes using CSS variables
 * from @420cry/420cry-lib theme system.
 *
 * These utilities use CSS variables injected by ThemeProvider, ensuring they
 * actually reference the theme values from the library.
 *
 * The theme values are injected as CSS variables (--theme-*) by ThemeProvider,
 * and these functions generate Tailwind classes that use those variables via
 * Tailwind's arbitrary value syntax: [var(--theme-*)]
 */
import type { CSSProperties } from 'react'

type ColorName =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'gray'
  | 'white'
  | 'black'
type ColorScale =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 'DEFAULT'
type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type RadiusSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
type ShadowSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Get theme-based background color class using CSS variables
 * Uses actual theme values from @420cry/420cry-lib via CSS variables
 *
 * @example
 * themeBg('primary', '500') // 'bg-[var(--theme-primary-500)]'
 * themeBg('gray', '50') // 'bg-[var(--theme-gray-50)]'
 */
export function themeBg(
  color: ColorName,
  scale: ColorScale = 'DEFAULT',
): string {
  if (color === 'white') return 'bg-white'
  if (color === 'black') return 'bg-black'

  const scaleValue = scale === 'DEFAULT' ? '500' : scale
  // Use CSS variable that references the actual theme value
  return `bg-[var(--theme-${color}-${scaleValue})]`
}

/**
 * Get theme-based text color class using CSS variables
 * Uses actual theme values from @420cry/420cry-lib via CSS variables
 *
 * @example
 * themeText('primary', '600') // 'text-[var(--theme-primary-600)]'
 * themeText('gray', '900') // 'text-[var(--theme-gray-900)]'
 */
export function themeText(
  color: ColorName,
  scale: ColorScale = 'DEFAULT',
): string {
  if (color === 'white') return 'text-white'
  if (color === 'black') return 'text-black'

  const scaleValue = scale === 'DEFAULT' ? '500' : scale
  // Use CSS variable that references the actual theme value
  return `text-[var(--theme-${color}-${scaleValue})]`
}

/**
 * Get theme-based border color class using CSS variables
 * Uses actual theme values from @420cry/420cry-lib via CSS variables
 *
 * @example
 * themeBorder('gray', '200') // 'border-[var(--theme-gray-200)]'
 */
export function themeBorder(
  color: ColorName,
  scale: ColorScale = 'DEFAULT',
): string {
  if (color === 'white') return 'border-white'
  if (color === 'black') return 'border-black'

  const scaleValue = scale === 'DEFAULT' ? '500' : scale
  // Use CSS variable that references the actual theme value
  return `border-[var(--theme-${color}-${scaleValue})]`
}

/**
 * Get theme-based padding class using CSS variables
 * Uses actual theme spacing values from @420cry/420cry-lib via CSS variables
 *
 * @example
 * themePadding('md') // 'p-[var(--theme-spacing-md)]' (uses theme spacing md = 1rem)
 * themePadding('lg') // 'p-[var(--theme-spacing-lg)]' (uses theme spacing lg = 1.5rem)
 */
export function themePadding(size: SpacingSize): string {
  // Use CSS variable that references the actual theme spacing value
  return `p-[var(--theme-spacing-${size})]`
}

/**
 * Get theme-based margin class using CSS variables
 * Uses actual theme spacing values from @420cry/420cry-lib via CSS variables
 *
 * @example
 * themeMargin('lg') // 'm-[var(--theme-spacing-lg)]'
 */
export function themeMargin(size: SpacingSize): string {
  // Use CSS variable that references the actual theme spacing value
  return `m-[var(--theme-spacing-${size})]`
}

/**
 * Get theme-based gap class using CSS variables
 * Uses actual theme spacing values from @420cry/420cry-lib via CSS variables
 *
 * @example
 * themeGap('md') // 'gap-[var(--theme-spacing-md)]'
 */
export function themeGap(size: SpacingSize): string {
  // Use CSS variable that references the actual theme spacing value
  return `gap-[var(--theme-spacing-${size})]`
}

/**
 * Get theme-based border radius class using CSS variables
 * Uses actual theme border radius values from @420cry/420cry-lib via CSS variables
 *
 * @example
 * themeRadius('lg') // 'rounded-[var(--theme-radius-lg)]'
 * themeRadius('full') // 'rounded-full' (special case, uses Tailwind class)
 */
export function themeRadius(size: RadiusSize): string {
  // Special case for 'full' - use Tailwind's rounded-full
  if (size === 'full') return 'rounded-full'

  // Use CSS variable that references the actual theme border radius value
  return `rounded-[var(--theme-radius-${size})]`
}

/**
 * Get theme-based shadow style object for inline styles
 * Uses actual theme shadow values from @420cry/420cry-lib via CSS variables
 *
 * Note: Tailwind's shadow utilities don't support arbitrary CSS variable values well,
 * so we return a style object that can be used with the style prop
 *
 * @example
 * <div style={themeShadow('lg')}>Content</div>
 * // Results in: style={{ boxShadow: 'var(--theme-shadow-lg)' }}
 */
export function themeShadow(size: ShadowSize): CSSProperties {
  return {
    boxShadow: `var(--theme-shadow-${size})`,
  }
}

/**
 * Get theme-based shadow class (fallback using Tailwind's predefined shadows)
 * For better compatibility, you can use this with Tailwind's shadow classes
 *
 * @example
 * themeShadowClass('lg') // 'shadow-lg' (uses Tailwind's predefined shadow)
 */
export function themeShadowClass(size: ShadowSize): string {
  const shadowMap: Record<ShadowSize, string> = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  }
  return shadowMap[size] || 'shadow-md'
}

/**
 * Get dark mode variant of a class
 * Useful for creating dark mode classes
 *
 * @example
 * dark(themeBg('gray', '800')) // 'dark:bg-[var(--theme-gray-800)]'
 */
export function dark(className: string): string {
  return `dark:${className}`
}

/**
 * Get hover variant of a theme background color
 * Uses CSS variables from theme
 *
 * @example
 * hoverBg('primary', '600') // 'hover:bg-[var(--theme-primary-600)]'
 */
export function hoverBg(
  color: ColorName,
  scale: ColorScale = 'DEFAULT',
): string {
  if (color === 'white') return 'hover:bg-white'
  if (color === 'black') return 'hover:bg-black'

  const scaleValue = scale === 'DEFAULT' ? '500' : scale
  return `hover:bg-[var(--theme-${color}-${scaleValue})]`
}

/**
 * Combine theme classes with custom classes
 * Filters out falsy values and joins with spaces
 *
 * @example
 * themeClass(themeBg('primary'), themeText('white'), 'px-4')
 * // 'bg-primary-500 text-white px-4'
 */
export function themeClass(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Common theme class combinations
 * Pre-built combinations for common use cases
 */
export const themeCombos = {
  // Backgrounds
  bgSurface: () =>
    themeClass(themeBg('gray', '50'), dark(themeBg('gray', '900'))),
  bgCard: () => themeClass(themeBg('white'), dark(themeBg('gray', '800'))),
  bgCardHover: () =>
    themeClass(themeBg('gray', '50'), dark(themeBg('gray', '700'))),

  // Text
  textPrimary: () =>
    themeClass(themeText('gray', '900'), dark(themeText('white'))),
  textSecondary: () =>
    themeClass(themeText('gray', '600'), dark(themeText('gray', '300'))),
  textMuted: () =>
    themeClass(themeText('gray', '500'), dark(themeText('gray', '400'))),

  // Borders
  borderDefault: () =>
    themeClass(themeBorder('gray', '200'), dark(themeBorder('gray', '700'))),
  borderCard: () =>
    themeClass(themeBorder('gray', '200'), dark(themeBorder('gray', '700'))),

  // Cards
  // Note: For shadows, use themeShadow() as inline style or themeShadowClass() for Tailwind class
  card: () =>
    themeClass(
      themeBg('white'),
      dark(themeBg('gray', '800')),
      themeBorder('gray', '200'),
      dark(themeBorder('gray', '700')),
      themeRadius('lg'),
      themeShadowClass('md'),
    ),

  // Buttons
  buttonPrimary: () =>
    themeClass(
      themeBg('primary', '500'),
      themeText('white'),
      themeRadius('md'),
      hoverBg('primary', '600'),
      'transition-colors',
    ),

  buttonSecondary: () =>
    themeClass(
      themeBg('gray', '100'),
      dark(themeBg('gray', '700')),
      themeText('gray', '900'),
      dark(themeText('white')),
      themeBorder('gray', '300'),
      dark(themeBorder('gray', '600')),
      themeRadius('md'),
      hoverBg('gray', '200'),
      dark(hoverBg('gray', '600')),
      'transition-colors',
    ),
} as const
