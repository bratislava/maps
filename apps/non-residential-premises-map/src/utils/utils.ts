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
        const originalOccupancy = feature.properties?.["Obsadenosť"];
        const occupancy =
          originalOccupancy === "na prenájom"
            ? "forRent"
            : originalOccupancy === "obsadené"
            ? "occupied"
            : originalOccupancy === "nie je k dispozícii"
            ? "other"
            : "free";
        const color =
          occupancy === "forRent"
            ? colors.forRent
            : occupancy === "occupied"
            ? colors.occupied
            : occupancy === "other"
            ? colors.other
            : colors.free;
        const locality = feature.properties?.["Ulica_a_číslo_vchodu"];
        const street = locality.replaceAll(/[0-9]/g, "").trim().split(",")[0];
        const competition =
          feature.properties?.["Aktuálne_prebiehajúca_súťaž"] === "neprebieha"
            ? false
            : feature.properties?.["Aktuálne_prebiehajúca_súťaž"];

        return {
          ...feature,
          properties: {
            ...originalPropertiesKeys.reduce(
              (prev, key) => ({ ...prev, [`ORIGINAL_${key}`]: feature.properties?.[key] }),
              {},
            ),
            locality,
            purpose: feature.properties?.["Účel_nájmu"],
            lessee: feature.properties?.["Nájomca"],
            // sometimes the picture urls come with a token in query string, which forces you to login even when the picture is public
            // in such cases, getting rid of the entire query (which shouldn't contain anything else of value) solves the issue
            picture: feature.properties?.["picture"]?.split("?")[0],
            streetView: feature.properties?.["GOOGLE_odkaz"],
            occupancy,
            rentUntil: feature.properties?.["Doba_nájmu"],
            description: feature.properties?.["Poznámka"],
            approximateArea: feature.properties?.["Orientačná_výmera_v_m2"],
            approximateRentPricePerYear: feature.properties?.["Orientačná_cena_nájmu_za_rok"],
            linkNZ: feature.properties?.["Odkaz_NZ"],
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
