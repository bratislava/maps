const styles = [
  {
    id: 'assistants',
    type: 'symbol',
    layout: {
      'icon-image': 'assistant',
      'icon-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        // zoom is 11 (or less) -> scale will be 0.5
        11,
        0.5,
        // zoom is 20 (or greater) -> scale will be 1
        20,
        1,
      ],
    },
  },
];

export default styles;
