import { colors } from "../../../utils/colors";

const styles = [
  {
    id: "esri",
    type: "circle",
    paint: {
      "circle-color": colors.black,
      "circle-opacity": 1,
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 11 (or less) -> radius will be 2
        11,
        2,
        // zoom is 20 (or greater) -> radius will be 16
        20,
        16,
      ],
    },
  },
];

export default styles;
