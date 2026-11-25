/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        cream: '#F3ECE1',
        sindoor: {
          DEFAULT: '#A61C24',
          deep: '#781117',
          bright: '#C92A2A',
        },
        terracotta: '#C85A32',
        kansa: {
          DEFAULT: '#C59B38',
          light: '#E6CA7E',
          muted: '#7D5E1B', // AA: 5.6:1 on ivory, 5.1:1 on cream
        },
        indigoNight: '#1B263B',
        ink: '#24191A',
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        bengali: ['"Noto Serif Bengali"', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
