/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary-color)',
				secondary: 'var(--secondary-color)',
				'primary-gray': 'var(--primary-gray-color)',
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
				130: '32.5rem',
				160: '40rem',
				navbar: '65px',
			},
			height: {
				'screen-content': 'calc(100dvh - 65px)',
			},
			zIndex: {
				99: 99,
				999: 999,
				9999: 9999,
				99999: 99999,
			},
			fontFamily: {
				kanit: ['var(--font-kanit)'],
			},
			animation: {
				like: 'like 0.7s steps(28) forwards;',
			},
			keyframes: {
				like: {
					to: { backgroundPosition: 'right' },
				},
			},
		},
	},
	corePlugins: {
		// Remove the Tailwind CSS preflight styles so it can use Material UI's preflight instead (CssBaseline).
		preflight: false,
	},
	plugins: [require('tailwind-scrollbar-hide')],
}
