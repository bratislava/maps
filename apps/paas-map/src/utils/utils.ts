import { addDistrictPropertyToLayer } from "@bratislava/react-maps-core";
import { FeatureCollection, Feature } from "geojson";

import rawDataAssistants from "../data/assistants/assistants.json";
import rawDataBranches from "../data/branches/branches.json";
import rawDataParkomats from "../data/parkomats/parkomats.json";
import rawDataPartners from "../data/partners/partners.json";
import rawDataGarages from "../data/garages/garages.json";
import rawDataPPlusR from "../data/p-plus-r/p-plus-r.json";
import rawDataPPlusRRegion from "../data/p-plus-r-region/p-plus-r-region.json";

import rawUdrData from "../data/udr/udr.json";
import rawOdpData from "../data/odp/odp.json";

export const getProcessedData = () => {
  let GLOBAL_ID = 0;

  const markersData: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      /*
        ASSISTNANTS
      */
      ...rawDataAssistants.features.map((feature) => {
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
      }),

      /*
        BRANCHES
      */
      ...rawDataBranches.features.map((feature) => {
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
      ...rawDataParkomats.features.map((feature) => {
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
      }),

      /*
        PARTNERS
      */
      ...rawDataPartners.features.map((feature) => {
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
      }),

      /*
        GARAGES
      */
      ...rawDataGarages.features.map((feature) => {
        GLOBAL_ID++;
        const kind = "garages-visitor";
        const icon = "garage-visitor";
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
        GARAGES
      */
      ...rawDataGarages.features.map((feature) => {
        GLOBAL_ID++;
        const kind = "garages-resident";
        const icon = "garage-resident";
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
        P + R
      */
      ...rawDataPPlusR.features.map((feature) => {
        GLOBAL_ID++;
        const kind = "p-plus-r";
        const icon = "p-plus-r";
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
        P + R REGIONS
      */
      ...rawDataPPlusRRegion.features.map((feature) => {
        GLOBAL_ID++;
        const kind = "p-plus-r-region";
        const icon = "p-plus-r-region";
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
    ],
  });

  const udrData: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      ...rawUdrData.features.map((feature) => {
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
      }),
    ],
  });

  const odpData: FeatureCollection = addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      ...rawOdpData.features.map((feature) => {
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
      }),
    ],
  });

  return {
    markersData,
    udrData,
    odpData,
  };
};
