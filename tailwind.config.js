/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        line: {
          green: '#06C755',
          'green-dark': '#05A346',
          'bg': '#F8FAFC',
          'message': '#9FE870'
        },
        carbon: {
          primary: '#064E3B',
          secondary: '#065F46', 
          accent: '#059669',
          light: '#10B981',
          forest: '#1F2937',
          sage: '#6B7280'
        },
        luxury: {
          gold: '#F59E0B',
          silver: '#9CA3AF',
          platinum: '#E5E7EB',
          copper: '#D97706'
        }
      },
      fontFamily: {
        'noto': ['Noto Sans JP', 'sans-serif'],
        'hiragino': ['Hiragino Sans', 'sans-serif']
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'swipe-indicator': 'swipeIndicator 2s ease-in-out infinite'
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        swipeIndicator: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '50%': { transform: 'translateX(20px)', opacity: '0.7' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}