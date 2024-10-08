/** @type {import('tailwindcss').Config} */
const flowbite = require('flowbite-react/tailwind')

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content(), './node_modules/flowbite/**/*.tsx|.ts'],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif']
      }
    }
  },
  plugins: [flowbite.plugin(), require('tailwind-scrollbar')]
}
