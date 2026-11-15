/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F3F6F8',
          100: '#E4EBF0',
          200: '#C6D4DE',
          300: '#96AEBF',
          400: '#5F7F96',
          500: '#3D5F78',
          600: '#2A475E',
          700: '#1D374B',
          800: '#12293B',
          900: '#0B1B2B',
          950: '#06131F',
        },
        ivory: '#F7F4EE',
        sand: '#EFEAE1',
        champagne: {
          100: '#F4ECDF',
          200: '#E8DAC2',
          300: '#D9C4A2',
          400: '#CBB08A',
          500: '#C2A173',
          600: '#AE8C5D',
          700: '#8E7048',
        },
        mist: '#EDF1F4',
        ink: '#111C26',
      },
      fontFamily: {
        sans: ['"Vazirmatn Variable"', 'Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      opacity: {
        6: '0.06',
        8: '0.08',
        12: '0.12',
        15: '0.15',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        85: '0.85',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      boxShadow: {
        soft: '0 18px 45px -28px rgba(11, 27, 43, 0.45)',
        lift: '0 30px 60px -35px rgba(11, 27, 43, 0.55)',
      },
      maxWidth: {
        shell: '1240px',
      },
      keyframes: {
        'hero-zoom': {
          '0%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'hero-loading': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        'hero-zoom': 'hero-zoom 2.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 1.2s ease-out both',
        'hero-loading': 'hero-loading 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
