import { addDistrictPropertyToLayer } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { FeatureCollection, Feature } from "geojson";
import { rawDataCvicko } from "../data/cvicko/cvicko";
import { rawDataPools } from "../data/pools/pools";

const hiddenLayerKinds = [
  "asfaltová plocha",
  "detské ihrisko",
  "dráha",
  "materská škola",
  "základná škola",
  "základná škola- bez ŠI",
  "stredná škola",
  "vysoká škola",
  "turistický chodník",
];

type Kind =
  | "hockey"
  | "fitness"
  | "tennis"
  | "water"
  | "football"
  | "table-tennis"
  | "basketball"
  | "gym"
  | "pool"
  | "running-track"
  | "other";

const getKind = (kind: string): Kind => {
  switch (kind) {
    case "štadión":
    case "Zimný štadión":
      return "hockey";
    case "fitness":
    case "Fitness centrum":
      return "fitness";
    case "tenisový kurt":
    case "Tenisové ihrisko":
    case "Tenisové kurty":
      return "tennis";
    case "vodné aktivity":
    case "vodná plocha":
      return "water";
    case "futbalové ihrisko":
    case "Futbalové ihrisko - umelá tráva":
    case "Futbalové ihrisko":
      return "football";
    case "stolný tenis":
    case "Stolnotenisová hala":
      return "table-tennis";
    case "basketbalové ihrisko":
    case "Basketbalové ihrisko":
    case "basketbal":
      return "basketball";
    case "posilňovňa":
    case "workout":
    case "Posilňovňa, workoutové ihrisko, minigolf":
      return "gym";
    case "plaváreň":
    case "plávanie":
    case "Plaváreň":
      return "pool";
    case "Atletická dráha":
    case "Bežecký okruh":
      return "running-track";
    default:
      return "other";
  }
};

export const processData = (rawDataFeatures: Feature[], rawDataAltFeatures: Feature[]) => {
  let GLOBAL_ID = 0;
  const data: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      ...rawDataFeatures.map((feature) => {
        GLOBAL_ID++;
        const layer = "sportGrounds";
        const tags = [getKind(feature.properties?.kind ?? feature.properties?.type)];
        const icon = getKind(feature.properties?.kind ?? feature.properties?.type);
        return {
          ...feature,
          id: GLOBAL_ID,
          properties: {
            ...feature.properties,
            tags,
            layer,
            icon,
            id: GLOBAL_ID,
          },
        } as Feature;
      }),
      ...rawDataAltFeatures.map((feature) => {
        GLOBAL_ID++;
        const layer = "sportGrounds";
        const oldKind = feature.properties?.kind;
        const tags = [getKind(feature.properties?.kind ?? feature.properties?.type)];
        const icon = getKind(feature.properties?.kind ?? feature.properties?.type);
        return {
          ...feature,
          id: GLOBAL_ID,
          properties: {
            ...feature.properties,
            tags,
            layer,
            icon,
            oldKind,
            id: GLOBAL_ID,
          },
        } as Feature;
      }),
      ...rawDataCvicko.features.map((feature) => {
        GLOBAL_ID++;
        const layer = "cvicko";
        const tags = feature.properties?.tags?.map((tag: string) => getKind(tag));
        const icon = "cvicko";
        return {
          id: GLOBAL_ID,
          ...feature,
          properties: {
            ...feature.properties,
            layer,
            tags,
            icon,
            id: GLOBAL_ID,
          },
        } as Feature;
      }),
      ...rawDataPools.features.map((feature) => {
        GLOBAL_ID++;
        const layer = "swimmingPools";
        const tags = feature.properties?.tags?.map((tag: string) => getKind(tag));
        const icon = "pool";
        return {
          id: GLOBAL_ID,
          ...feature,
          properties: {
            ...feature.properties,
            layer,
            tags,
            icon,
            id: GLOBAL_ID,
          },
        } as Feature;
      }),
    ].filter((feature) => !hiddenLayerKinds.find((kind) => kind === feature.properties?.oldKind)),
  });

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district");
  const uniqueTypes: string[] = getUniqueValuesFromFeatures(data.features, "tags");

  return {
    data,
    uniqueDistricts,
    uniqueTypes,
  };
};
