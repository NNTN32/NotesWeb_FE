/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
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