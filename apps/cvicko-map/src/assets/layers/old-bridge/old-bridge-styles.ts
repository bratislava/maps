const styles = [
  {
    id: "old-bridge-line-bg",
    type: "line",
    paint: {
      "line-color": "#883E98",
      "line-opacity": 1,
      "line-offset": [
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
    id: "old-bridge-line-middle",
    type: "line",
    paint: {
      "line-color": "#E5E5E5",
      "line-opacity": 1,
      "line-offset": [
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
      "line-width": 1,
    },
  },
];

export default styles;
