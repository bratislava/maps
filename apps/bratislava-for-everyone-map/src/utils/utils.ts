import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { featureCollection } from "@turf/turf";
import { FeatureCollection } from "geojson";

export const processData = () => {
  const data: FeatureCollection = addDistrictPropertyToLayer(featureCollection([]));

  // const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district").sort(
  //   (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  // );

  return {
    data,
    uniqueDistricts: [...DISTRICTS],
    uniqueOccupancies: [],
  };
};
