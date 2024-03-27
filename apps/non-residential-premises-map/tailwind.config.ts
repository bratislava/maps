import { colors } from "./src/utils/colors";
import tailwindConfig from "@bratislava/react-maps-ui/tailwind.config";

export default {
  presets: [tailwindConfig],
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
        other: colors.other,
        "for-rent": colors.forRent,
      },
    },
  },
};
