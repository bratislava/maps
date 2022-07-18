import { FeatureCollection, Feature } from "geojson";
import { rawData } from "../data/drinking-fountains/drinking-fountains";

export const processData = () => {
  let GLOBAL_ID = 0;
  const data: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      ...rawData.features.map((feature) => {
        GLOBAL_ID++;
        return {
          ...feature,
          id: GLOBAL_ID,
          properties: {
            ...feature.properties,
            id: GLOBAL_ID,
          },
        } as Feature;
      }),
    ],
  };

  return {
    data,
  };
};
