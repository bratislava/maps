/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

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
        gray: {
          lightmode: "#D85D30",
          darkmode: "#FFEFE9",
        },
        background: {
          lightmode: "#FFEFE9",
          darkmode: "#D85D30",
        },
        foreground: {
          lightmode: "#D85D30",
          darkmode: "#FFEFE9",
        },
        primary: {
          DEFAULT: "#88E0FF",
          soft: "#88E0FF",
        },
        secodary: {
          DEFAULT: "#D93D04",
          soft: "#D93D04",
        },
        blue: {
          DEFAULT: "#066384",
          soft: "#BDEBFF",
        },
      },
      fontFamily: {
        laca: ["laca"],
      },
    },
  },
};
