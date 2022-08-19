import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import {
  getRandomItemFrom,
  getSeasonFromDate,
  getUniqueValuesFromFeatures,
} from "@bratislava/utils";
import { Feature, FeatureCollection } from "geojson";

// predefined colors for points
export const mapCircleColors: { [index: string]: string | string[] } = {
  fellingByPermit: "#E03F00",
  emergencyFelling: "#E57D00",
  invasivePlantsFelling: "#F4B056",
  trimming: ["#FFD400", "#FCE304", "#FFF500", "#FCE300", "#FFE045", "#FEE980", "#FFE600"],
  injectionOfInvasivePlants: "#351900",
  fallenTreeRemoval: "#BC9F82",
  mistletoeManagement: "#7F674A",
  stumpRemoval: "#54463B",
};

export const mapSlovakTypeToEnglishKey: { [index: string]: string } = {
  "výrub z rozhodnutia": "fellingByPermit",
  "výrub havarijný": "emergencyFelling",
  "výrub inváznej dreviny": "invasivePlantsFelling",
  orez: "trimming",
  "injektáž inváznej dreviny": "injectionOfInvasivePlants",
  "odstránenie padnutého stromu": "fallenTreeRemoval",
  "manažment imela": "mistletoeManagement",
  "frézovanie pňa": "stumpRemoval",
  "frézovanie pňov": "stumpRemoval",
  "dendrologický posudok": "dendrologicalAssessment",
};

export const processData = (
  rawData: FeatureCollection,
  categories: { label: string; types: string[] }[],
) => {
  const data: FeatureCollection = addDistrictPropertyToLayer({
    ...rawData,
    features: rawData.features.map((feature) => {
      const slovakType = feature.properties?.TYP_VYKONU_1?.toLowerCase();
      const type = mapSlovakTypeToEnglishKey[slovakType ?? ""];
      const dateString = feature.properties?.TERMIN_REAL_1;
      const year = dateString ? new Date(dateString).getFullYear().toString() : undefined;
      const season = getSeasonFromDate(dateString);
      const color = getRandomItemFrom(mapCircleColors[type]) ?? "#54463B";

      return {
        ...feature,
        properties: {
          ...feature.properties,
          TYP_VYKONU_1: type,
          season,
          color,
          year,
        },
      } as Feature;
    }),
  });

  const typesFromDefinedCategories = categories.reduce((allTypes: string[], category) => {
    category.types.forEach((type) => {
      if (!allTypes.includes(type)) {
        allTypes.push(type);
      }
    });
    return allTypes;
  }, []);

  const uniqueYears: string[] = getUniqueValuesFromFeatures(data.features, "year").sort(
    (a, b) => parseInt(b) - parseInt(a),
  );
  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );
  const seasons = ["spring", "summer", "autumn", "winter"];
  const uniqueSeasons: string[] = getUniqueValuesFromFeatures(data.features, "season").sort(
    (a, b) => seasons.findIndex((d) => d == a) - seasons.findIndex((d) => d == b) ?? 0,
  );
  const uniqueTypes: string[] = getUniqueValuesFromFeatures(data.features, "TYP_VYKONU_1");

  const otherTypes = uniqueTypes.filter(
    (uniqueType) =>
      !typesFromDefinedCategories.find(
        (typeFromDefinedCategories) => typeFromDefinedCategories == uniqueType,
      ),
  );

  return {
    data,
    uniqueYears,
    uniqueDistricts,
    uniqueSeasons,
    uniqueTypes,
    otherTypes,
  };
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
