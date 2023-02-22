
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
        headers: "#1F1F1F",
        text: "#333333",
        primary: {
          DEFAULT: colors.defaultBlue,
          soft: colors.lightBlue,
        },
        closure: {
          DEFAULT: colors.closuresColor,
          soft: colors.closuresSoft,
        },
        disorder: {
          DEFAULT: colors.disorderColor,
          soft: colors.disorderSoft,
        },
        // repair: {
        //   DEFAULT: colors.repair,
        //   soft: colors.repairSoft,
        // },
        digup: {
          DEFAULT: colors.digupColor,
          soft: colors.digupSoft,
        }
      },
    },
  },
};
