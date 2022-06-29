import { addDistrictPropertyToLayer } from "@bratislava/mapbox-maps-core";
import {
  getRandomItemFrom,
  getSeasonFromDate,
  getUniqueValuesFromFeatures,
} from "@bratislava/maps-utils";
import { FeatureCollection, Feature } from "geojson";

// predefined colors for points
const mapCircleColors: { [index: string]: string | string[] } = {
  "výrub inváznej dreviny": "#F4B056",
  "výrub havarijný": "#E57D00",
  "výrub z rozhodnutia": "#E03F00",
  "manažment imela": "#7F674A",
  "injektáž inváznej dreviny": "#351900",
  "odstránenie padnutého stromu": "#BC9F82",
  "frézovanie pňa": "#54463B",
  orez: ["#FFD400", "#FCE304", "#FFF500", "#FCE300", "#FFE045", "#FEE980", "#FFE600"],
};

export const processData = (
  rawData: FeatureCollection,
  categories: { label: string; types: string[] }[],
) => {
  const data: FeatureCollection = addDistrictPropertyToLayer({
    ...rawData,
    features: rawData.features.map((feature) => {
      const type = feature.properties?.TYP_VYKONU_1?.toLowerCase();
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

  const uniqueYears: string[] = getUniqueValuesFromFeatures(data.features, "year");
  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district");
  const uniqueSeasons: string[] = getUniqueValuesFromFeatures(data.features, "season");
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
