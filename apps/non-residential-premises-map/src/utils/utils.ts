import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { featureCollection } from "@turf/helpers";
import { FeatureCollection } from "geojson";
import colors from "../utils/colors.json";

export const processData = (rawData: FeatureCollection) => {
  const data: FeatureCollection = addDistrictPropertyToLayer(
    featureCollection(
      rawData.features.map((feature) => {
        const originalPropertiesKeys = Object.keys(feature.properties ?? {});
        const occupancy = feature.properties?.["Obsadenosť"] === "obsadené" ? "occupied" : "free";
        const color = occupancy === "occupied" ? colors.occupied : colors.free;
        return {
          ...feature,
          properties: {
            ...originalPropertiesKeys.reduce(
              (prev, key) => ({ ...prev, [`ORIGINAL_${key}`]: feature.properties?.[key] }),
              {},
            ),
            purpose: feature.properties?.["Účel"],
            lessee: feature.properties?.["Nájomca"],
            occupancy,
            rentUntil: feature.properties?.["Doba_nájmu"],
            description: feature.properties?.["Poznámka"],
            approximateArea: feature.properties?.["Orientačná_výmera_v_m2"],
            approximateRentPricePerYear: feature.properties?.["Cena_rok"],
            color,
          },
        };
      }),
    ),
  );

  const uniqueOccupancies = getUniqueValuesFromFeatures(data.features, "occupancy");
  const uniquePurposes = getUniqueValuesFromFeatures(data.features, "purpose");

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );

  return {
    data,
    uniqueDistricts,
    uniqueOccupancies,
    uniquePurposes,
  };
};
