/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./htmlFiles/**/*.html",
    "./game/**/*.html",
    "./Public/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
