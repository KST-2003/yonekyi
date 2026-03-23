/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1d4ed8',
          600: '#1d4ed8',
          700: '#1e40af',
          DEFAULT: '#1d3a8a',
        },
        accent: {
          DEFAULT: '#f97316',
          hover: '#ea6c0a',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
