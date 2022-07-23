# React Mapbox

This library tries to wrap mapbox-js imperative library functionalities with React components.

##  Components

### `<Mapbox />`

Main component which displays map.

### `<Layer />`

Layer provides native displaying of geojson features.

### `<Marker />`

Marker displays React component inside map.

### `<Cluster />`

Cluster provides way to cluster markers.

### `<Filter />`

Filter provides context with filters to children elements.

##  Hooks

### `useFilter`

Creates utility functions to handle filtering.

### `useCombinedFilter`

Utility hook to combine filters from `useFilter` hook.
