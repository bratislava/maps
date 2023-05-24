import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { featureCollection } from "@turf/helpers";
import { FeatureCollection } from "geojson";
import { colors } from "../utils/colors";

export const processData = (rawData: FeatureCollection) => {
  const data: FeatureCollection = addDistrictPropertyToLayer(
    featureCollection(
      rawData.features.map((feature) => {
        const originalPropertiesKeys = Object.keys(feature.properties ?? {});
        const originalOccupancy = feature.properties?.["obsadenost"];
        const occupancy =
          originalOccupancy === "na prenájom"
            ? "forRent"
            : originalOccupancy === "obsadené"
              ? "occupied"
              : "free";
        const color =
          occupancy === "forRent"
            ? colors.forRent
            : occupancy === "occupied"
              ? colors.occupied
              : colors.free;
        const locality = feature.properties?.["ulica"];
        const street = locality.replaceAll(/[0-9]/g, "").trim().split(",")[0];
        const competition =
          feature.properties?.["OVS_aktualne"] === "neprebieha"
            ? false
            : feature.properties?.["OVS_aktualne"];
        return {
          ...feature,
          properties: {
            ...originalPropertiesKeys.reduce(
              (prev, key) => ({ ...prev, [`ORIGINAL_${key}`]: feature.properties?.[key] }),
              {},
            ),
            locality,
            purpose: feature.properties?.["ucel_najmu"],
            lessee: feature.properties?.["najomca"],
            picture: feature.properties?.["picture"],
            occupancy,
            rentUntil: feature.properties?.["doba_najmu"],
            description: feature.properties?.["poznamka"],
            approximateArea: feature.properties?.["orientacna_vymera_m2"],
            approximateRentPricePerYear: feature.properties?.["cena"],
            color,
            street,
            competition,
          },
        };
      }),
    ),
  );

  const uniqueOccupancies = getUniqueValuesFromFeatures(data.features, "occupancy");
  const uniquePurposes = getUniqueValuesFromFeatures(data.features, "purpose")
    .sort()
    .filter((p) => p !== "iné")
    .concat(["iné"]);
  const uniqueStreets = getUniqueValuesFromFeatures(data.features, "street");

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );

  return {
    data,
    uniqueDistricts,
    uniqueOccupancies,
    uniquePurposes,
    uniqueStreets,
  };
};
