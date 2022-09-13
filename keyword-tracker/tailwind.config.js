/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/core/**/*.html',
    './src/app/core/**/*.ts',
    './src/app/core/**/*.scss',
    './src/styles/**/*.scss'
  ],
  theme: {
    extend: {
      colors: {
        grey: {
          light: '#F4F4F4',
          dark: '#A2A2A2',
          input: '#b5b5b5',
          darker: '#363636',
          task: '#d6d5d5',
          background: '#ecf0f3'
        },
        green: {
          light: '#44ddd0',
          medium: '#39dbcd',
          dark: '#2075314a'
        },
        google: '#E56B57',
        pink: {
          100: '#F0E3E4',
          200: '#E7C5C8',
          300: '#E9AAAF',
          400: '#E77A82',
          500: '#E54E59',
          600: '#D44751',
          700: '#AE3C44',
          800: '#78262C',
          900: '#4D1B1F',
          'light': '#FBF7F7',
          'black': '#17090B',
          'ash': '#EDDDE0'
        },
        gold: {
          100: '#fad1bb',
          200: '#f6b48f',
          300: '#f39961',
          400: '#f0853c',
          500: '#ef730c',
          600: '#e46d06',
          700: '#d76501',
          800: '#ca5d00',
          900: '#b25000',
        },
        red: {
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
        black: '#3B3B3B'
      },
    },
  },
  variants: {},
  plugins: [],
}
