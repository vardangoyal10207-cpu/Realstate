/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B1F3A', 800: '#12294a', 700: '#1b3860', 600: '#27497a' },
        // gold.DEFAULT is for fills / text on navy. Use gold-dark for text on light backgrounds (AA).
        gold: { DEFAULT: '#C9A24B', light: '#E3C98A', dark: '#7A5C14' },
        cream: { DEFAULT: '#F7F5F0', 200: '#EEEAE0' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,31,58,.06), 0 8px 24px -12px rgba(11,31,58,.18)',
        lift: '0 18px 40px -16px rgba(11,31,58,.35)',
      },
      borderRadius: { card: '16px', ctl: '12px' },
      keyframes: {
        'fade-up': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'slide-in': { from: { transform: 'translateX(-100%)' }, to: { transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up .3s ease-out both',
        'fade-in': 'fade-in .25s ease-out both',
        'slide-in': 'slide-in .25s ease-out both',
      },
    },
  },
  plugins: [],
};
