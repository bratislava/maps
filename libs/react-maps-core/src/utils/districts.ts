import DATA_DISTRICTS from "../assets/layers/districts.json";
import booleanIntersects from "@turf/boolean-intersects";
import { Feature, FeatureCollection } from "geojson";

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
] as const;

type District = typeof DISTRICTS[number];

export const addDistrictPropertyToLayer = (
  featureCollection: FeatureCollection
) => {
  return {
    ...featureCollection,
    features: featureCollection.features.map((feature: Feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          district: getFeatureDistrict(feature),
        },
      };
    }),
  };
};

export const getFeatureDistrict = (feature: Feature): District | null => {
  const districtFeatures = DATA_DISTRICTS.features;

  for (let i = 0; i < districtFeatures.length; i++) {
    const districtFeature = districtFeatures[i];

    if (booleanIntersects(districtFeature.geometry, feature)) {
      return districtFeature.properties.name as District;
    }
  }
  return null;
};