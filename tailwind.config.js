/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#00132B',
        'primary-lighter': '#021A39',
        'secondary': '#4D5A6B',
        'accent': '#11CBF4',
        'accent-fade': 'rgba(17, 202, 245, 0.15)',
        'soft-blue': '#E7FAFE',
        'text-dark': '#222222',
        'text-light': '#908D8D',
        'soft-gray': '#D9D9D9',
        'soft-gray-2': '#EDF0F4'
      }
    },
  },
  plugins: [],
}

