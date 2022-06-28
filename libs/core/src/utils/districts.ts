import DATA_DISTRICTS from "../assets/layers/districts.json";
import booleanIntersects from "@turf/boolean-intersects";
import { Feature } from "geojson";

export const DISTRICTS = [
  "Staré Mesto",
  "Ružinov",
  "Vrakuňa",
  "Podunajské Biskupice",
  "Nové Mesto",
  "Rača",
  "Vajnory",
  "Karlova Ves",
  "Dúbravka",
  "Lamač",
  "Devín",
  "Devínska Nová Ves",
  "Záhorská Bystrica",
  "Petržalka",
  "Jarovce",
  "Rusovce",
  "Čunovo",
];

export const addDistrictPropertyToLayer = (geojson: any) => {
  const districtFeatures = DATA_DISTRICTS.features;

  return {
    ...geojson,
    features: geojson.features.map((feature: Feature) => {
      for (let i = 0; i < districtFeatures.length; i++) {
        const districtFeature = districtFeatures[i];

        if (booleanIntersects(districtFeature.geometry, feature)) {
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
