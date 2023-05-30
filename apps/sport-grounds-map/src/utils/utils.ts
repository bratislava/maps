import { addDistrictPropertyToLayer } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { FeatureCollection, Feature } from "geojson";
import { generateRawWorkoutData } from "../data/cvicko/cvicko";
import { generateRawPoolData } from "../data/pools/pools";
import type { IPool, IWorkout } from "../../src/data/types"

interface IProcessDataProps {
  rawDataPools: Array<IPool>;
  rawDataCvicko: Array<IWorkout>;
}

export const processData = ({ rawDataPools, rawDataCvicko }: IProcessDataProps) => {
  const poolData = generateRawPoolData(rawDataPools);
  const cvickoData = generateRawWorkoutData(rawDataCvicko);

  let GLOBAL_ID = 0;
  const data: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      ...cvickoData.features.map((feature) => {
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
      ...poolData.features.map((feature) => {
        GLOBAL_ID++;
        const layer = "swimmingPools";
        const icon = feature.properties?.email === "zlatepiesky@starz.sk" ? "water" : "pool";
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

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district");
  const uniqueTypes: string[] = getUniqueValuesFromFeatures(data.features, "tags");

  return {
    data,
    uniqueDistricts,
    uniqueTypes,
  };
};
