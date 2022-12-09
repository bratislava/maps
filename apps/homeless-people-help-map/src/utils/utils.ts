import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { FeatureCollection, Point } from "geojson";
import { data as rawData } from "../data/data";

export const processData = () => {
  const data: FeatureCollection<Point> = addDistrictPropertyToLayer(
    rawData,
  ) as FeatureCollection<Point>;

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );

  const uniqueSubLayers = getUniqueValuesFromFeatures(data.features, "subLayerName");

  return {
    data,
    uniqueDistricts,
    uniqueSubLayers,
  };
};
