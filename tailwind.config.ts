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
      },
    },
  },
  plugins: [],
} satisfies Config
