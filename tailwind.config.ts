import type { Config } from 'tailwindcss'

export default {
  content: ['./node_modules/@420cry/420cry-lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        radialLeft: '#02AAB0',
        radialRight: '#00CDAC',
        neutralDark: '#080B1A',
        'neutralGray-3': '#CFD0D3',
        'neutralGray-5': '#797980',
      },
    },
  },
  plugins: [],
} satisfies Config
