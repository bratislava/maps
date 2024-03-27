# React Mapbox

This library tries to wrap mapbox-js imperative library functionalities with React components. It has no design, it is pure funcionality wrapper.

## Components

### `<Mapbox />`

Main component which displays map.

### `<Layer />`

Layer provides mapbox native displaying of geojson features.

### `<Marker />`

Marker displays React component inside map. It also provides props for scaling those components based on actual zoom level.

### `<Cluster />`

Cluster provides way to cluster markers based on space between them.

### `<Filter />`

Filter provides context with filters to children elements so you dont have to pass filters to every marker or a layer.

## Hooks

### `useFilter`

Creates utility functions to handle filtering. For simple filtering, it is enough, but sometimes when filters behaviour is very complex, then creating own function to build those filter expessions is a better way.

### `useCombinedFilter`

Utility hook to combine filters from `useFilter` hook.
