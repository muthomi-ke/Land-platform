/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#effdf5',
          100: '#d9fbe7',
          200: '#b5f6d2',
          300: '#7eecb3',
          400: '#3fd78d',
          500: '#13b26c',
          600: '#0a8d54',
          700: '#0a6f44',
          800: '#0b5636',
          900: '#09462d'
        }
      },
      boxShadow: {
        'soft-2xl': '0 24px 60px rgba(15,23,42,0.35)'
      }
    }
  },
  plugins: []
};




