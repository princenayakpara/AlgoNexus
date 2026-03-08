/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          400: '#818cf8',
          500: '#6366f1',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        neon: {
          green: '#00ff88',
          cyan: '#00d4ff',
          purple: '#a855f7',
          blue: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}
