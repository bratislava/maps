/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("./src/utils/colors.json");

module.exports = {
  presets: [require("../../libs/react-maps-ui/tailwind.config")],
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts,tsx}",
    "../../libs/react-maps-ui/src/**/*.{html,ts,tsx}",
    "../../libs/react-maps/src/**/*.{html,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.primary,
          soft: colors.primarySoft,
        },
        free: colors.free,
        occupied: colors.occupied,
      },
    },
  },
};
