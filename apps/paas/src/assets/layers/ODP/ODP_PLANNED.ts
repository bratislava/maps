//#16254c modra
//#89c764 zelena
//#fcac00 oranzova

const styles = [
  {
    id: 'odp-planned-line',
    type: 'line',
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#fcac00',
        '#4287f5',
      ],
      'line-dasharray': [4, 2],
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
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
    id: 'odp-planned-fill',
    type: 'fill',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#fcac00',
        '#4287f5',
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
