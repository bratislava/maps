import { colors } from "../../utils/colors";

const styles = [
  {
    id: "terrain-services-line",
    type: "line",
    paint: {
      "line-color": colors.terrainServices,
      "line-opacity": 0.4,
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 11 (or less) -> circle radius will be 1px
        11,
        2,
        // zoom is 20 (or greater) -> circle radius will be 3px
        20,
        5,
      ],
    },
  },
  {
    id: "terrain-services-fill",
    type: "fill",
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        colors.terrainServices,
        colors.terrainServices,
      ],
      "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.4, 0.2],
    },
  },
];

export default styles;
