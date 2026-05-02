/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      keyframes: {
        authLiquidMorph: {
          "0%, 100%": {
            borderRadius: "58% 42% 62% 38% / 42% 58% 38% 62%",
          },
          "33%": {
            borderRadius: "42% 58% 48% 52% / 52% 48% 58% 42%",
          },
          "66%": {
            borderRadius: "52% 48% 38% 62% / 62% 38% 52% 48%",
          },
        },
      },
      animation: {
        "auth-liquid": "authLiquidMorph 10s ease-in-out infinite",
      },
      colors: {
        paper: '#f9f5e7',
        sand: '#efe3c8',
        latte: '#dfd3c3',
        ink: '#2f2a2a',
        coffee: '#6b4f4f',
        terracotta: '#a27b5c',
        olive: '#7c8a6a',
        plum: '#4a4e69',
        rose: '#c9ada7',
        brass: '#b08d57'
      }
    },
  },
  plugins: [],
} 