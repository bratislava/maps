import { FeatureCollection } from "geojson";

export const cvickoData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "lafranconi",
        name: "Cvičko Lafranconi",
      },
      geometry: { type: "Point", coordinates: [17.075586, 48.143773] },
    },
    {
      type: "Feature",
      properties: {
        id: "nabrezie",
        name: "Cvičko Nábrežie",
      },
      geometry: { type: "Point", coordinates: [17.07946, 48.143182] },
    },
    {
      type: "Feature",
      properties: {
        id: "promenada",
        name: "Cvičko Promenáda",
      },
      geometry: { type: "Point", coordinates: [17.117367, 48.139899] },
    },
    {
      type: "Feature",
      properties: {
        id: "tyrsak",
        name: "Cvičko Tyršák",
      },
      geometry: { type: "Point", coordinates: [17.117959, 48.135942] },
    },
    {
      type: "Feature",
      properties: {
        id: "apollo",
        name: "Cvičko Apollo",
      },
      geometry: { type: "Point", coordinates: [17.12839, 48.134552] },
    },
    {
      type: "Feature",
      properties: {
        id: "most-snp",
        name: "Cvičko Most SNP",
      },
      geometry: { type: "Point", coordinates: [17.104784, 48.136283] },
    },
  ],
};
