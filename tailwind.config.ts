import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@420cry/420cry-lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'oklch(0.76 0.1422 175.5)',
        secondary: 'oklch(0.67 0.1138 199.27)',
        danger: 'oklch(0.59 0.1788 24.53)',
        success: 'oklch(0.75 0.1271 164.59)',
        warning: 'oklch(0.86 0.1339 80.09)',
        neutralDark: '#080B1A',
        'neutralGray-3': '#CFD0D3',
        'neutralGray-5': '#797980',
        // Theme-aware button colors
        'button-default-bg': 'var(--color-button-default-bg)',
        'button-default-text': 'var(--color-button-default-text)',
        'button-default-border': 'var(--color-button-default-border)',
        'button-default-hover': 'var(--color-button-default-hover)',
        'button-default-ring': 'var(--color-button-default-ring)',
        'button-outline-border': 'var(--color-button-outline-border)',
        'button-outline-text': 'var(--color-button-outline-text)',
        'button-outline-hover-bg': 'var(--color-button-outline-hover-bg)',
        'button-outline-hover-text': 'var(--color-button-outline-hover-text)',
        'button-text-text': 'var(--color-button-text-text)',
        'button-text-hover': 'var(--color-button-text-hover)',
        'badge-bg': 'var(--color-badge-bg)',
        'badge-text': 'var(--color-badge-text)',
        'badge-ring': 'var(--color-badge-ring)',
        // Input field colors
        'input-bg': 'var(--color-input-bg)',
        'input-text': 'var(--color-input-text)',
        'input-border': 'var(--color-input-border)',
        'input-placeholder': 'var(--color-input-placeholder)',
        'input-focus-border': 'var(--color-input-focus-border)',
        'input-focus-ring': 'var(--color-input-focus-ring)',
        // Card colors
        'card-border': 'var(--color-card-border)',
        'card-bg-light': 'var(--color-card-bg-light)',
        'card-bg-dark': 'var(--color-card-bg-dark)',
        'card-icon': 'var(--color-card-icon)',
        'card-hover': 'var(--color-card-hover)',
        'card-ring': 'var(--color-card-ring)',
      },
    },
  },
  plugins: [],
} satisfies Config
