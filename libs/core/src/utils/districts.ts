import DATA_DISTRICTS from "../assets/layers/districts.json";
import booleanIntersects from "@turf/boolean-intersects";
import { Feature } from "geojson";

export const DISTRICTS = [
  "Staré Mesto",
  "Podunajské Biskupice",
  "Ružinov",
  "Vrakuňa",
  "Nové Mesto",
  "Rača",
  "Vajnory",
  "Devínska Nová Ves",
  "Dúbravka",
  "Devín",
  "Lamač",
  "Záhorská Bystrica",
  "Čunovo",
  "Jarovce",
  "Petržalka",
  "Rusovce",
];

export const addDistrictPropertyToLayer = (geojson: any) => {
  const districtFeatures = DATA_DISTRICTS.features;
  return {
    ...geojson,
    features: geojson.features.map((feature: Feature) => {
      for (let i = 0; i < districtFeatures.length; i++) {
        const districtFeature = districtFeatures[i];

        if (booleanIntersects(districtFeature.geometry, feature.geometry)) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              district: districtFeature.properties["name"],
            },
          };
        }
      }
      return feature;
    }),
  };
};
