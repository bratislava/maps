/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
    extend: {},
  },
  plugins: [],
};
