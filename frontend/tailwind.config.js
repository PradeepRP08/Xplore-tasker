/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['Clash Display', 'Sora', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6471f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        quantum: {
          bg: 'var(--quantum-bg)',
          fg: 'var(--quantum-fg)',
          accent: 'var(--quantum-accent)',
          glow: 'var(--quantum-glow)',
          glass: 'var(--quantum-glass)',
        },
        spectral: {
          cyan: '#00f5ff',
          magenta: '#ff00ff',
          lime: '#0ff0a0',
          violet: '#aa00ff',
          plasma: 'linear-gradient(135deg, #00f5ff, #ff00ff, #0ff0a0)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
        'glow': '0 0 40px rgba(100,113,241,0.3)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6471f1 0%, #a78bfa 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }
    },
  },
  plugins: [],
}
