/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBF9F4',
          100: '#F3EEE3',
          200: '#E5DAC3',
          300: '#D0BC97',
          400: '#B69A6B',
          500: '#A1814F',
          600: '#87683E',
          700: '#6B5132',
          800: '#53402A',
          900: '#3E3120',
        },
        ink: {
          50: '#F8F7F4',
          100: '#ECE9E4',
          200: '#DCD8D0',
          300: '#B7B1A6',
          400: '#918A7D',
          500: '#6F6A5F',
          600: '#545046',
          700: '#3B3831',
          800: '#24221D',
          900: '#15140F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'ui-serif', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(21 20 15 / 0.04), 0 1px 3px 0 rgb(21 20 15 / 0.05)',
        lift: '0 16px 40px -16px rgb(21 20 15 / 0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.45s ease both',
        shimmer: 'shimmer 1.5s linear infinite',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};