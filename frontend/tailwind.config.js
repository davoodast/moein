/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'persian': ['A-Iranian-Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cream': '#faf8f3',
        'gold': '#d4af37',
        'deep-black': '#0a0a0a',
        'warm-gray': '#1a1a2e',
        'dark-purple': '#16213e',
        'purple-accent': '#6b4fb0',
        'light-purple': '#8b6bb0',
      },
      backgroundColor: {
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}

