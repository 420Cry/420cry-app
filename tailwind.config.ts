import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@420cry/420cry-lib/**/*.{js,ts,jsx,tsx}',
  ],
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
      fontSize: {
        'header-sm': '40px',
        'header-md': '56px',
        'header-lg': '80px',
        'subheader': '32px',
        'body-sm': '14px',
        'body-md': '20px',
      },
    },
  },
  plugins: [],
} satisfies Config
