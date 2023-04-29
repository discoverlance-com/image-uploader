const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', ...defaultTheme.fontFamily.sans]
			},
			boxShadow: {
				default: '0 4px 12px 0 rgb(0 0 0 / 0.1)'
			},
			colors: {
				'primary-gray': {
					50: '#F6F8FB',
					100: '#BDBDBD',
					200: '#A9A9A9',
					300: '#828282',
					400: '#4F4F4F'
				},
				'secondary-blue': {
					100: '#97BEF4',
					200: '#2F80ED'
				}
			}
		}
	},
	plugins: []
};
