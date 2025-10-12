/**module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
*/

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      // Custom class for centering content under the fixed header
      minHeight: {
        'screen-minus-header': 'calc(100vh - 64px)', // Adjust 64px based on your header height
      }
    },
  },
  plugins: [],
}
    
