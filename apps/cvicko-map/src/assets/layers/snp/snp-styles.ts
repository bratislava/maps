const styles = [
  {
    id: "snp-line-bg",
    type: "line",
    layout: {
      "line-cap": "round",
    },
    paint: {
      "line-color": "#F2A121",
      "line-opacity": 1,
      "line-offset": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 11 (or less) -> line width will be 10px
        11,
        1,
        // zoom is 20 (or greater) -> line width will be 50px
        20,
        12,
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
    id: "snp-line-middle",
    type: "line",
    paint: {
      "line-color": "#E5E5E5",
      "line-offset": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 11 (or less) -> line width will be 10px
        11,
        1,
        // zoom is 20 (or greater) -> line width will be 50px
        20,
        12,
      ],
      "line-opacity": 1,
      "line-width": 1,
    },
  },
];

export default styles;
