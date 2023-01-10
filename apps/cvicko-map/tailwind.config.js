/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

import { themeColors } from "./src/utils/colors"

export default {
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
          lightmode: themeColors.orange,
          darkmode: themeColors.softOrange,
        },
        background: {
          lightmode: themeColors.softOrange,
          darkmode: themeColors.orange,
        },
        foreground: {
          lightmode: themeColors.orange,
          darkmode: themeColors.softOrange,
        },
        primary: {
          DEFAULT: themeColors.lightBlue,
          soft: themeColors.lightBlue,
        },
        secodary: {
          DEFAULT: themeColors.red,
          soft: themeColors.red,
        },
        blue: {
          DEFAULT: themeColors.blue,
          soft: themeColors.softBlue,
        },
      },
      fontFamily: {
        laca: ["laca"],
      },
    },
  },
};
