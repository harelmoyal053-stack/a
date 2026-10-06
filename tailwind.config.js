/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./festivals/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { 900: '#0b0b0d', 800: '#1c1c1f', 700: '#2a2a2e' },
        accent: '#facc15',
        whatsapp: '#25d366',
      },
      fontFamily: {
        hebrew: ['Rubik', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fill-bar': 'fillBar 1.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-width)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
