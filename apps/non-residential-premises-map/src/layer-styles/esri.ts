import colors from "../utils/colors.json";

const styles = [
  {
    id: "esri",
    type: "circle",
    paint: {
      "circle-color": colors.primary,
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 11 (or less) -> radius will be 2
        15,
        6,
        // zoom is 20 (or greater) -> radius will be 16
        20,
        12,
      ],
    },
  },
];

export default styles;
