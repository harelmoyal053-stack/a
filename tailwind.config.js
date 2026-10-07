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
        // FestiChat palette: near-black surfaces, one acid accent.
        ink: { 950: '#070707', 900: '#0b0b0b', 800: '#141414', 700: '#1c1c1c', 600: '#262626' },
        muted: '#8b8b8b',
        accent: '#c6ff3d',
        whatsapp: '#c6ff3d',
      },
      fontFamily: {
        hebrew: ['Rubik', 'Arial', 'sans-serif'],
        ui: ['"IBM Plex Sans Hebrew"', '"IBM Plex Sans"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        num: ['"IBM Plex Mono"', '"IBM Plex Sans Hebrew"', '"IBM Plex Sans"', '"IBM Plex Sans Arabic"', 'ui-monospace', 'monospace'],
        poster: ['"IBM Plex Sans Condensed"', '"IBM Plex Sans Hebrew"', '"IBM Plex Sans"', '"IBM Plex Sans Arabic"', 'sans-serif'],
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
