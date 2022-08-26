import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { Feature, FeatureCollection } from "geojson";

export interface IProcessDataProps {
  rawDisordersData: FeatureCollection;
  rawDigupsAndClosuresData: FeatureCollection;
  rawRepairsPointsData: FeatureCollection;
  rawRepairsPolygonsData: FeatureCollection;
}

export const processData = ({
  rawDisordersData,
  rawDigupsAndClosuresData,
  rawRepairsPointsData,
  rawRepairsPolygonsData,
}: IProcessDataProps) => {
  const disordersData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawDisordersData,
    features: rawDisordersData.features.map((feature) => {
      const originalProperties = feature.properties;
      return {
        ...feature,
        properties: {
          ...originalProperties,
          layer: "disorders",
        },
      } as Feature;
    }),
  });

  const digupsAndClosuresData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawDigupsAndClosuresData,
    features: rawDigupsAndClosuresData.features.map((feature) => {
      const originalProperties = feature.properties;
      const layer =
        originalProperties?.["uz_vierka"] === "čiastočná" ||
        originalProperties?.["uz_vierka"] === "úplná"
          ? "closures"
          : "digups";

      return {
        ...feature,
        properties: {
          ...originalProperties,
          layer,
        },
      } as Feature;
    }),
  });

  const digupsData: FeatureCollection = {
    ...digupsAndClosuresData,
    features: digupsAndClosuresData.features.filter(
      (feature) => feature.properties?.layer === "digups",
    ),
  };

  const closuresData: FeatureCollection = {
    ...digupsAndClosuresData,
    features: digupsAndClosuresData.features.filter(
      (feature) => feature.properties?.layer === "closures",
    ),
  };

  const repairsPointData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawRepairsPointsData,
    features: rawRepairsPointsData.features.map((feature) => {
      const originalProperties = feature.properties;
      const date = originalProperties?.datum;
      return {
        ...feature,
        properties: {
          ...originalProperties,
          layer: "repairs",
          date,
        },
      } as Feature;
    }),
  });

  const repairsPolygonsData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawRepairsPolygonsData,
    features: rawRepairsPolygonsData.features.map((feature) => {
      const originalProperties = feature.properties;
      return {
        ...feature,
        properties: {
          ...originalProperties,
          layer: "repairs",
        },
      } as Feature;
    }),
  });

  const allFeatures = [
    ...disordersData.features,
    ...digupsData.features,
    ...closuresData.features,
    ...repairsPointData.features,
    ...repairsPolygonsData.features,
  ];

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(allFeatures, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );

  const uniqueLayers: string[] = getUniqueValuesFromFeatures(allFeatures, "layer").sort();

  return {
    disordersData,
    digupsData,
    repairsPointData,
    repairsPolygonsData,
    closuresData,
    uniqueLayers,
    uniqueDistricts,
  };
};
