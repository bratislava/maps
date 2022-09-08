const styles = [
  {
    id: "districts-line",
    type: "line",
    paint: {
      "line-color": "#1C80F5",
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
];

export default styles;
