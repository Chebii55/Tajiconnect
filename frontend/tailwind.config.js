/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1C3D6E',
          light: '#3DAEDB',
          dark: '#12284B',
        },
        secondary: {
          DEFAULT: '#4A9E3D',
          dark: '#2F6B29',
        },
        neutral: {
          white: '#FFFFFF',
          light: '#F2F2F2',
          dark: '#333333',
        },
        accent: {
          teal: '#2C857A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}