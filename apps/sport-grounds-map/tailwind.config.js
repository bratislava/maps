/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  presets: [require("../../libs/react-maps-core/tailwind.config")],
  content: [
    "./src/**/*.{html,ts,tsx}",
    "../../libs/react-maps-core/src/**/*.{html,ts,tsx}",
    "../../libs/react-maps-ui/src/**/*.{html,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1300px",
    },
    extend: {
      fontSize: {
        xs: ["10px", "14px"],
        sm: ["12px", "16px"],
        DEFAULT: ["16px", "20px"],
        md: ["20px", "24px"],
        lg: ["24px", "28px"],
        xl: ["32px", "40px"],
        xxl: ["42px", "54px"],
      },
      colors: {
        primary: {
          DEFAULT: "#5158D8",
          soft: "#C7CAFF",
        },
        background: {
          DEFAULT: "#ffffff",
        },
        foreground: {
          DEFAULT: "#ffffff",
        },
        gray: {
          DEFAULT: "#333333",
        },
        black: {
          DEFAULT: "black",
        },
      },
    },
  },
};
