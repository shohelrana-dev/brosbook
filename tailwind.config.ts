import { nextui } from '@nextui-org/react'
//@ts-ignore
import scrollbarHide from 'tailwind-scrollbar-hide'
import type { Config } from 'tailwindcss'

const config: Config = {
	mode: 'jit',
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
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
				navbar: '3.5rem',
			},
			height: {
				'screen-content': 'calc(100dvh - 3.5rem)',
			},
			zIndex: {
				'99': '99',
				'999': '999',
				'9999': '9999',
				'99999': '99999',
			},
			fontFamily: {
				kanit: ['var(--font-kanit)'],
			},
			animation: {
				like: 'like 1s steps(28) forwards;',
			},
			keyframes: {
				like: {
					to: { backgroundPosition: 'right' },
				},
			},
		},
	},
	plugins: [
		scrollbarHide,
		nextui({
			prefix: 'brosbook',
			themes: {
				light: {
					colors: {
						danger: {
							DEFAULT: '#F60002',
						},
					},
				},
			},
			layout: {
				/* radius: {
					small: '3px', // rounded-small
					medium: '6px', // rounded-medium
					large: '10px', // rounded-large
				}, */
				borderWidth: {
					small: '1px', // border-small
					medium: '1px', // border-medium
					large: '2px', // border-large
				},
			},
		}),
	],
}

export default config
