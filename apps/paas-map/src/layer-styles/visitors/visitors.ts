const styles = [
  {
    id: 'udr-line',
    type: 'line',
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#fcac00',
        '#89c764',
      ],
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        // zoom is 11 (or less) -> circle radius will be 1px
        11,
        1,
        // zoom is 20 (or greater) -> circle radius will be 3px
        20,
        3,
      ],
    },
  },
  {
    id: 'udr-fill',
    type: 'fill',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#fcac00',
        '#89c764',
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.4,
        0.2,
      ],
    },
  },
];

export default styles;