/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#E5B544',
          'gold-hover': '#CF9F30',
          'gold-light': '#FAF2DE',
          red: '#F51F2B',
          'red-hover': '#D61420',
          'red-light': '#FFF1F2',
          cream: '#FFFCF5',
          navy: '#101C38',
          silver: '#A7ADB4',
          dark: '#101C38',
          secondary: '#53627A',
        },
        navy: {
          DEFAULT: '#101C38',
          dark: '#0B1429',
          light: '#1B2C52',
          muted: '#243763',
        },
        gold: {
          DEFAULT: '#E5B544',
          hover: '#CF9F30',
          light: '#FAF2DE',
          soft: '#FAF2DE',
        },
        red: {
          DEFAULT: '#F51F2B',
          hover: '#D61420',
          light: '#FFF1F2',
          deep: '#C71219',
        },
        cream: {
          DEFAULT: '#FFFCF5',
          soft: '#FFFDF5',
        },
        silver: {
          DEFAULT: '#A7ADB4',
          light: '#E5E7EB',
          border: '#E5E7EB',
        },
        char: {
          DEFAULT: '#171717',
          dark: '#171717',
          muted: '#53627A',
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
        handwriting: ['Caveat', 'cursive'],
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
