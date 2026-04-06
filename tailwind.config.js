/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hebrew: ['Rubik', 'Arial', 'sans-serif'],
      },
      colors: {
        dark: {
          950: '#020408',
          900: '#050810',
          800: '#0a0e1a',
          700: '#0f1628',
          600: '#1a2038',
          500: '#232b48',
          400: '#2e3a5a',
          300: '#3d4f72',
        },
        neon: {
          green: '#00ff88',
          'green-dim': '#00cc6a',
          blue: '#00b4ff',
          'blue-dim': '#0088cc',
          purple: '#7b2ff7',
          cyan: '#00f5ff',
          orange: '#ff6b35',
        },
      },
      boxShadow: {
        'neon-green':    '0 0 20px rgba(0,255,136,0.35)',
        'neon-green-lg': '0 0 40px rgba(0,255,136,0.25)',
        'neon-blue':     '0 0 20px rgba(0,180,255,0.35)',
        'glass':         '0 8px 32px rgba(0,0,0,0.5)',
        'glass-lg':      '0 20px 60px rgba(0,0,0,0.6)',
      },
      animation: {
        'fire':          'fire 0.55s ease-in-out infinite alternate',
        'glow-green':    'glowGreen 2s ease-in-out infinite',
        'glow-blue':     'glowBlue 2s ease-in-out infinite',
        'ticker':        'ticker 28s linear infinite',
        'float':         'float 2.8s ease-in-out infinite',
        'pulse-neon':    'pulseNeon 1.5s ease-in-out infinite',
        'hot-badge':     'hotBadge 1.5s ease-in-out infinite',
        'countdown-glow':'countdownGlow 0.9s ease-in-out infinite',
        'shimmer-dark':  'shimmerDark 2.5s linear infinite',
        'shimmer':       'shimmer 2s infinite',
      },
      keyframes: {
        fire: {
          '0%':   { filter: 'drop-shadow(0 0 4px #ff4500) drop-shadow(0 0 8px #ff6600) brightness(1)', transform: 'scale(1) rotate(-1deg)' },
          '100%': { filter: 'drop-shadow(0 0 10px #ffaa00) drop-shadow(0 0 22px #ff4500) brightness(1.35)', transform: 'scale(1.12) rotate(2deg)' },
        },
        glowGreen: {
          '0%,100%': { boxShadow: '0 0 12px rgba(0,255,136,0.25)' },
          '50%':     { boxShadow: '0 0 30px rgba(0,255,136,0.55)' },
        },
        glowBlue: {
          '0%,100%': { boxShadow: '0 0 12px rgba(0,180,255,0.25)' },
          '50%':     { boxShadow: '0 0 30px rgba(0,180,255,0.55)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px) scale(1)' },
          '50%':     { transform: 'translateY(-9px) scale(1.04)' },
        },
        pulseNeon: {
          '0%,100%': { opacity: '1',   textShadow: '0 0 8px rgba(0,255,136,0.7)' },
          '50%':     { opacity: '0.7', textShadow: '0 0 22px rgba(0,255,136,1)' },
        },
        hotBadge: {
          '0%,100%': { boxShadow: '0 0 8px rgba(255,107,53,0.5)' },
          '50%':     { boxShadow: '0 0 22px rgba(255,200,0,0.85), 0 0 44px rgba(255,107,53,0.5)' },
        },
        countdownGlow: {
          '0%,100%': { textShadow: '0 0 8px rgba(255,68,68,0.9)'  },
          '50%':     { textShadow: '0 0 20px rgba(255,0,0,1), 0 0 40px rgba(255,0,0,0.5)' },
        },
        shimmerDark: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
        fillBar: {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--fill-width)' },
        },
      },
    },
  },
  plugins: [],
}
