import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { FeatureCollection } from "geojson";
import { data as rawData } from "../data/data";

export const processData = () => {
  const data: FeatureCollection = addDistrictPropertyToLayer(rawData);

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );

  return {
    data,
    uniqueDistricts,
  };
};
