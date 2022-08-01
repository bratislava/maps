import { FeatureCollection, Feature } from "geojson";

import { apolloRawData } from "../assets/layers/apollo/apollo-data";
import { oldBridgeRawData } from "../assets/layers/old-bridge/old-bridge-data";
import { snpRawData } from "../assets/layers/snp/snp-data";

export const getProcessedData = () => {
  const apolloData: FeatureCollection = {
    ...apolloRawData,
    features: apolloRawData.features.map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
        },
      } as Feature;
    }),
  };

  const oldBridgeData: FeatureCollection = {
    ...oldBridgeRawData,
    features: oldBridgeRawData.features.map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
        },
      } as Feature;
    }),
  };

  const snpData: FeatureCollection = {
    ...snpRawData,
    features: snpRawData.features.map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
        },
      } as Feature;
    }),
  };

  return {
    apolloData,
    oldBridgeData,
    snpData,
  };
};
