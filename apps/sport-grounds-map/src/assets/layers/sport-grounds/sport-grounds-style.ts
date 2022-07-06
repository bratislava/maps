const styles = [
  {
    id: "sports-grounds-points",
    type: "symbol",
    layout: {
      "icon-image": ["get", "icon"],

      // 'icon-anchor': 'bottom',
      "icon-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 11 (or less) -> scale will be 0.5
        11,
        0.25,
        // zoom is 20 (or greater) -> scale will be 1
        20,
        0.5,
      ],
    },
  },
];

export default styles;
