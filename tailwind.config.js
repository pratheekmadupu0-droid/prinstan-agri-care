/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0F6B3A',
        'secondary': '#D4AF37',
        'dark': '#1A1A1A',
        'light': '#F8F9FA',
        'brand-green': {
          DEFAULT: '#0F6B3A',
          50: '#f0fbf5',
          100: '#dcf5e6',
          200: '#bcead0',
          300: '#8fdaaf',
          400: '#5bc587',
          500: '#0F6B3A',
          600: '#0d5d32',
          700: '#0a4b28',
          800: '#083a1f',
          900: '#052614',
        },
        'brand-gold': {
          DEFAULT: '#D4AF37',
          50: '#fefcf3',
          100: '#fdf7db',
          200: '#faeeab',
          300: '#f7e375',
          400: '#f4d743',
          500: '#D4AF37',
          600: '#b6942a',
          700: '#927721',
          800: '#6d5919',
          900: '#493b11',
        },
        'brand-brown': {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a38478',
          600: '#8a685b',
          700: '#694e43',
          800: '#4a372f',
          900: '#2b1f1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
