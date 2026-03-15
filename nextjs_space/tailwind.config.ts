import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#5F8C8C',
          50: '#EBF1F1',
          100: '#D7E3E3',
          200: '#AFC7C7',
          300: '#87ABAB',
          400: '#5F8C8C',
          500: '#4A6E6E',
          600: '#3A5757',
          700: '#2B4040',
          800: '#1B2929',
          900: '#0C1212',
        },
        darkblue: {
          DEFAULT: '#2C3E50',
          50: '#E8ECF0',
          100: '#D1D9E1',
          200: '#A3B3C3',
          300: '#758DA5',
          400: '#476787',
          500: '#2C3E50',
          600: '#233240',
          700: '#1A2630',
          800: '#111920',
          900: '#080D10',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
