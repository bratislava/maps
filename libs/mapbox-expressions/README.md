# Mapbox expressions library

This library is useful when you want to evaluate [mapbox expressions](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#types).

It does not support all the features yet.

## Supported expressions

- decision
  - all
  - any
  - equals
  - gte
  - lte
- lookup
  - get
  - in

## Usage

```ts
import { Feature } from "geojson";
import { evaluate } from "@bratislava/mapbox-expressions";

const feature: Feature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
  properties: {
    name: "Matej",
    city: "Kosice",
  },
};

const result = evaluate(["all", ["==", "name", "Matej"], ["==", "city", "Kosice"]], feature);

console.log(result);
// true
```

## Testing

```
npm run test
```
