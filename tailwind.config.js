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
        // FestiChat palette: night-blue surfaces, a purple-to-blue brand gradient.
        ink: { 950: '#060913', 900: '#0a0e1b', 800: '#111729', 700: '#182038', 600: '#252e4b' },
        muted: '#8e99b3',
        accent: '#a974ff',
        whatsapp: '#a974ff',
        online: '#22c55e',
      },
      fontFamily: {
        hebrew: ['Rubik', 'Arial', 'sans-serif'],
        // Rubik covers Latin, Hebrew, Cyrillic and Arabic in one geometric family.
        ui: ['Rubik', 'system-ui', 'sans-serif'],
        num: ['Rubik', 'system-ui', 'sans-serif'],
        poster: ['Rubik', 'system-ui', 'sans-serif'],
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
