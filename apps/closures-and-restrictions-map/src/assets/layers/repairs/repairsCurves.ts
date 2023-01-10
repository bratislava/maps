import { colors } from "../../../utils/colors";

const styles = [
  {
    id: "repairs-curves",
    type: "line",
    paint: {
      "line-color": colors.purple,
      "line-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 1, 0.8],
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 5 (or less) -> circle radius will be 1px
        11,
        5,
        // zoom is 10 (or greater) -> circle radius will be 5px
        20,
        10,
      ],
    },
  },
];

export default styles;
