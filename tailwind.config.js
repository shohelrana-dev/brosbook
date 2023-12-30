/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "theme-green": '#159615',
        "theme-light-green": '#14CB15',
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
        100: '25rem',
        160: '40rem',
      },
      fontFamily: {
        kanit: ['var(--font-kanit)']
      },
    },
  },
  corePlugins: {
    // Remove the Tailwind CSS preflight styles so it can use Material UI's preflight instead (CssBaseline).
    preflight: false,
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
}
