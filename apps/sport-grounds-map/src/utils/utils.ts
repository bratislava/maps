import { addDistrictPropertyToLayer } from "@bratislava/react-maps-core";
import { getUniqueValuesFromFeatures } from "@bratislava/react-maps-utils";
import { FeatureCollection, Feature } from "geojson";

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
      return "basketball";
    case "posilňovňa":
    case "Posilňovňa, workoutové ihrisko, minigolf":
      return "gym";
    case "plaváreň":
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
  const data: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      ...rawDataFeatures.map((feature) => {
        const kind = getKind(feature.properties?.kind ?? feature.properties?.type);
        const icon = `${getKind(feature.properties?.kind ?? feature.properties?.type)}-icon`;
        return {
          ...feature,
          properties: {
            ...feature.properties,
            kind,
            icon,
          },
        } as Feature;
      }),
      ...rawDataAltFeatures.map((feature) => {
        const oldKind = feature.properties?.kind;
        const kind = getKind(feature.properties?.kind ?? feature.properties?.type);
        const icon = `${getKind(feature.properties?.kind ?? feature.properties?.type)}-icon`;
        return {
          ...feature,
          properties: {
            ...feature.properties,
            kind,
            icon,
            oldKind,
          },
        } as Feature;
      }),
    ].filter((feature) => !hiddenLayerKinds.find((kind) => kind === feature.properties?.oldKind)),
  });

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district");
  const uniqueTypes: string[] = getUniqueValuesFromFeatures(data.features, "kind");

  return {
    data,
    uniqueDistricts,
    uniqueTypes,
  };
};