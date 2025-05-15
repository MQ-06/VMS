/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d6efd',
        dark: '#121212',
        light: '#ffffff',
        blue1: '#012f56',
        blue2: '#012341',
        blue3: '#00172b',
        blue4: '#000c16',
        black: '#000000',
        blue5: '#0021f3'
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
