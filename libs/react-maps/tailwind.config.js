// eslint-disable-next-line no-undef
module.exports = {
  presets: [require('../react-maps-ui/tailwind.config')],
  content: [
    './src/**/*.{ts,tsx}',
    '../../libs/react-maps-ui/src/**/*.{html,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
