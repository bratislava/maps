import { addDistrictPropertyToLayer } from "@bratislava/react-maps";
import { Feature, FeatureCollection } from "geojson";

export interface ProcessDataOptions {
  rawAssistantsData: FeatureCollection;
  rawParkomatsData: FeatureCollection;
  rawPartnersData: FeatureCollection;
  rawParkingLotsData: FeatureCollection;
  rawBranchesData: FeatureCollection;
  rawUdrData: FeatureCollection;
  rawOdpData: FeatureCollection;
}

export const processData = ({
  rawAssistantsData,
  rawParkomatsData,
  rawPartnersData,
  rawParkingLotsData,
  rawBranchesData,
  rawUdrData,
  rawOdpData,
}: ProcessDataOptions) => {
  let GLOBAL_ID = 0;

  const markersData: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      /*
        ASSISTNANTS
      */
      ...rawAssistantsData.features
        .map((feature) => {
          GLOBAL_ID++;
          const kind = "assistants";
          const icon = "assistant";
          return {
            ...feature,
            id: GLOBAL_ID,
            properties: {
              ...feature.properties,
              kind,
              icon,
            },
          } as Feature;
        })
        .filter((f) => f.properties?.["web"] === "ano"),

      /*
        BRANCHES
      */
      ...rawBranchesData.features.map((feature) => {
        GLOBAL_ID++;
        const kind = "branches";
        const icon = "branch";
        return {
          ...feature,
          id: GLOBAL_ID,
          properties: {
            ...feature.properties,
            kind,
            icon,
          },
        } as Feature;
      }),

      /*
        PARKOMATS
      */
      ...rawParkomatsData.features
        .map((feature) => {
          GLOBAL_ID++;
          const kind = "parkomats";
          const icon = "parkomat";
          return {
            ...feature,
            id: GLOBAL_ID,
            properties: {
              ...feature.properties,
              kind,
              icon,
            },
          } as Feature;
        })
        .filter((f) => f.properties?.["Web"] === "ano"),

      /*
        PARTNERS
      */
      ...rawPartnersData.features
        .map((feature) => {
          GLOBAL_ID++;
          const kind = "partners";
          const icon = "partner";
          return {
            ...feature,
            id: GLOBAL_ID,
            properties: {
              ...feature.properties,
              kind,
              icon,
            },
          } as Feature;
        })
        .filter((f) => f.properties?.["web"] === "ano"),

      /*
        PARKING LOTS
      */
      ...rawParkingLotsData.features
        .map((feature) => {
          GLOBAL_ID++;
          const type =
            feature.properties?.["Typ_en"] == "P+R"
              ? "p-plus-r"
              : feature.properties?.["Typ_en"] == "garage"
              ? "garage"
              : "parking-lot";

          const kind =
            type == "p-plus-r" ? "p-plus-r" : type == "garage" ? "garages" : "parking-lots";
          const icon = type;
          return {
            ...feature,
            id: GLOBAL_ID,
            properties: {
              ...feature.properties,
              kind,
              icon,
            },
          } as Feature;
        })
        .filter((f) => f.properties?.["web"] === "ano"),
    ],
  });

  const udrData: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      ...rawUdrData.features
        .map((feature) => {
          GLOBAL_ID++;
          const layer = "visitors";
          return {
            ...feature,
            id: GLOBAL_ID,
            properties: {
              ...feature.properties,
              layer,
            },
          } as Feature;
        })
        .filter(
          (f) =>
            (f.properties?.["web"] === "ano" || f.properties?.["web"] === "ano - planned") &&
            (f.properties?.["Status"] === "active" || f.properties?.["Status"] === "planned"),
        ),
    ],
  });

  const odpData: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      ...rawOdpData.features
        .map((feature) => {
          GLOBAL_ID++;
          const layer = "residents";
          return {
            ...feature,
            id: GLOBAL_ID,
            properties: {
              ...feature.properties,
              layer,
            },
          } as Feature;
        })
        .filter(
          (f) => f.properties?.["Status"] === "active" || f.properties?.["Status"] === "planned",
        ),
    ],
  });

  return {
    markersData,
    udrData,
    odpData,
  };
};
