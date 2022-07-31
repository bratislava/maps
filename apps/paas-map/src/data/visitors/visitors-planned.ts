const styles = [
  {
    id: 'udr-planned-line',
    type: 'line',
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#fcac00',
        '#89c764',
      ],
      'line-dasharray': [4, 2],
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        // zoom is 11 (or less) -> circle radius will be 1px
        11,
        1,
        // zoom is 20 (or greater) -> circle radius will be 3px
        20,
        2,
      ],
    },
  },
  {
    id: 'udr-planned-fill',
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
        0.2,
        0.1,
      ],
    },
  },
];

export default styles;
