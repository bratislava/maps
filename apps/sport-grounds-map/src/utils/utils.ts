import { addDistrictPropertyToLayer } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { FeatureCollection, Feature } from "geojson";
import { rawDataCvicko } from "../data/cvicko/cvicko";
import { rawDataPools } from "../data/pools/pools";

export const processData = () => {
  let GLOBAL_ID = 0;
  const data: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      ...rawDataCvicko.features.map((feature) => {
        GLOBAL_ID++;
        const layer = "cvicko";
        const icon = "cvicko";
        return {
          id: GLOBAL_ID,
          ...feature,
          properties: {
            ...feature.properties,
            layer,
            icon,
            id: GLOBAL_ID,
          },
        } as Feature;
      }),
      ...rawDataPools.features.map((feature) => {
        GLOBAL_ID++;
        const layer = "swimmingPools";
        const icon = feature.properties["Nazov_SK"] === "Areál zdravia Zlaté piesky" ? "water" : "pool";
        return {
          id: GLOBAL_ID,
          ...feature,
          properties: {
            ...feature.properties,
            layer,
            icon,
            id: GLOBAL_ID,
          },
        } as Feature;
      }),
    ],
  });
}

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district");
  const uniqueTypes: string[] = getUniqueValuesFromFeatures(data.features, "tags");

  return {
    data,
    uniqueDistricts,
    uniqueTypes,
  };
};
