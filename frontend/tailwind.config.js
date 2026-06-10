/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        wcdi: {
          orange: '#f97316',
          orangeDark: '#ea580c',
          blue: '#667eea',
          purple: '#764ba2'
        }
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'pulse-slow': 'pulseSlow 2s ease-in-out infinite'
      },
      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' }
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: []
};
