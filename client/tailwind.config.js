/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
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
  variants: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar-hide')
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "rgb(58,141,245)",
          "secondary": "#F000B8",
          "accent": "#37CDBE",
          "neutral": "#3D4451",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
}
