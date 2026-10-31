/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#DFB24A',
          'gold-hover': '#C89B2B',
          'gold-light': '#FAF2DE',
          red: '#E31B23',
          'red-light': '#FFF1F2',
          silver: '#A7ADB4',
          dark: '#222222',
        },
        gold: {
          DEFAULT: '#DFB24A',
          hover: '#C89B2B',
          light: '#FAF2DE',
          soft: '#FAF2DE',
        },
        red: {
          DEFAULT: '#E31B23',
          hover: '#C71219',
          light: '#FFF1F2',
          deep: '#C71219',
        },
        silver: {
          DEFAULT: '#A7ADB4',
          light: '#E5E7EB',
          border: '#E5E7EB',
        },
        char: {
          DEFAULT: '#171717',
          dark: '#171717',
          muted: '#5B6472',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F7F8FA',
          card: '#FFFFFF',
          border: '#E5E7EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        sm: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        card: '0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 8px 16px -2px rgba(0, 0, 0, 0.08), 0 3px 6px -1px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
