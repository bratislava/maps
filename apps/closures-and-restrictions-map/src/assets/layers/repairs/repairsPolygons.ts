import { colors } from "../../../utils/colors";

const { purple } = colors

const styles = [
  {
    id: "repairs-polygons-line",
    type: "line",
    paint: {
      "line-color": purple,
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 5 (or less) -> circle radius will be 1px
        11,
        1,
        // zoom is 10 (or greater) -> circle radius will be 5px
        20,
        3,
      ],
    },
  },
  {
    id: "repairs-polygons-fill",
    type: "fill",
    paint: {
      "fill-color": purple,
      "fill-opacity": [
        "case",
        [
          "any",
          ["boolean", ["feature-state", "hover"], false],
          ["boolean", ["feature-state", "selected"], false],
        ],
        0.4,
        0.2,
      ],
    },
  },
];

export default styles;
