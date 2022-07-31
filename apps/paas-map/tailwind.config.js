/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  presets: [require("../../libs/react-maps-ui/tailwind.config")],
  content: [
    "./src/**/*.{html,ts,tsx}",
    "../../libs/react-maps-ui/src/**/*.{html,ts,tsx}",
    "../../libs/react-maps/src/**/*.{html,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#71CA55",
          soft: "#d1f0c7",
        },
        secondary: "#15254B",
      },
    },
  },
};
