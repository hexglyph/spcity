module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#BFDBEF",
          800: "#A0BDCF",
        },
        secondary: {
          500: "#2AA0C6",
        },
        tertiary: {
          500: "#1D5BA4",
        },
        quaternary: {
          500: "#FFB335",
        },          
      },
      flexBasis: {
          '1/7': '14.2857143%',
          '2/7': '28.5714286%',
          '3/7': '42.8571429%',
          '4/7': '57.1428571%',
          '5/7': '71.4285714%',
          '6/7': '85.7142857%',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}