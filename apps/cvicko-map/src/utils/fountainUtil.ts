import type { FeatureCollection, Feature } from "geojson";
import { rawData } from "../assets/layers/drinking-fountains/drinking-fountains";

export const processFountainData = () => {
  const data: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      ...rawData.features.map((feature, index) => {
        return {
          ...feature,
          id: index,
          properties: {
            ...feature.properties,
            id: index,
          },
        } as Feature;
      }),
    ],
  };

  return {
    data,
    list: data.features.map((f) => f.properties?.location),
  };
};
