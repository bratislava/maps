import { colors } from "./src/utils/colors";

export default {
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
          DEFAULT: colors.blue,
          soft: colors.darkBlue,
        },
      },
    },
  },
};
