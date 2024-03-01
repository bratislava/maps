import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { FeatureCollection, Point } from "geojson";
import { data as rawData } from "../data/data";
import { featureCollection } from "@turf/helpers";
import { fixpointAndSyringeExchangeData as rawFixpointAndSyringeExchangeData } from "../data/fixpointAndSyringeExchange";
import { drinkingFountainsData as rawDrinkingFountainsData } from "../data/drinking-fountains";

export const processData = () => {
  let GLOBAL_ID = 0;

  const data: FeatureCollection<Point> = addDistrictPropertyToLayer(
    featureCollection(
      rawData.features.map((f) => {
        GLOBAL_ID++;
        return {
          ...f,
          id: GLOBAL_ID,
          properties: {
            ...f.properties,
          },
        };
      }),
    ),
  );

  const fixpointAndSyringeExchangeData: FeatureCollection<Point> = addDistrictPropertyToLayer(
    featureCollection(
      rawFixpointAndSyringeExchangeData.features.map((f) => {
        GLOBAL_ID++;
        return {
          ...f,
          id: GLOBAL_ID,
          properties: {
            ...f.properties,
          },
        };
      }),
    ),
  );

  const drinkingFountainsData: FeatureCollection<Point> = addDistrictPropertyToLayer(
    featureCollection(
      rawDrinkingFountainsData.features.map((f) => {
        GLOBAL_ID++;
        return {
          ...f,
          id: GLOBAL_ID,
          properties: {
            ...f.properties,
          },
        };
      }),
    ),
  );

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );

  return {
    data,
    uniqueDistricts,
    fixpointAndSyringeExchangeData,
    drinkingFountainsData,
  };
};
