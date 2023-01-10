import { colors } from "../../../../utils/colors";

const styles = [
  {
    id: "apollo-line-bg",
    type: "line",
    layout: {
      "line-cap": "round",
    },
    paint: {
      "line-color": colors.red,
      "line-opacity": 1,
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 11 (or less) -> line width will be 10px
        11,
        2,
        // zoom is 20 (or greater) -> line width will be 50px
        20,
        24,
      ],
    },
  },
  {
    id: "apollo-line-middle",
    type: "line",
    paint: {
      "line-color": colors.lightGrey,
      "line-opacity": 1,
      "line-width": 1,
    },
  },
];

export default styles;
