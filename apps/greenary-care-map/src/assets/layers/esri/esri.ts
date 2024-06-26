import { colors } from "../../../utils/colors";

const styles = [
  {
    id: "esri",
    type: "circle",
    paint: {
      "circle-color": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        colors.white,
        ["get", "color"],
      ],
      "circle-stroke-color": ["get", "color"],
      "circle-stroke-width": ["case", ["boolean", ["feature-state", "selected"], false], 4, 1],
      "circle-opacity": [
        "case",
        [
          "any",
          ["boolean", ["feature-state", "hover"], false],
          ["boolean", ["feature-state", "selected"], false],
        ],
        1,
        0.8,
      ],
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
