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
          DEFAULT: "#80F1F6",
          soft: "#80F1F6",
        },
      },
      fontFamily: {
        laca: ["laca"],
      },
    },
  },
};
