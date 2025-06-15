/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        beige: '#f5f5f0', // FC Photo custom palette
        black: '#000000',
        white: '#ffffff',
      },
      backgroundImage: {
        'floral': "url('/src/assets/gray-floral.png')", // Named custom background
      },
    },
  },
  plugins: [],
}