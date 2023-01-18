const withMT = require("@material-tailwind/react/utils/withMT")

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  mode: 'jit',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    colors: {
      blue: 'rgb(58,141,245)',
      "gray-light": '#F1F6FB'
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        "theme-blue": 'rgb(58,141,245)',
        "theme-gray": '#F1F6FB',
        blue: {
          100: '#cce4f6',
          200: '#99c9ed',
          300: '#66afe5',
          400: '#3394dc',
          500: '#0079d3',
          600: '#0061a9',
          700: '#00497f',
          800: '#003054',
          900: '#00182a',
        },
      },
      spacing: {
        90: '22.5rem',
        160: '40rem',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
})