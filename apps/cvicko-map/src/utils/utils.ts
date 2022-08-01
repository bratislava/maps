import { apolloRawData } from "../assets/layers/apollo/apollo-data";
import { oldBridgeRawData } from "../assets/layers/old-bridge/old-bridge-data";
import { snpRawData } from "../assets/layers/snp/snp-data";
import { cvickoData } from "../assets/layers/cvicko/cvicko-data";

export const getProcessedData = () => {
  return {
    apolloData: apolloRawData,
    oldBridgeData: oldBridgeRawData,
    snpData: snpRawData,
    cvickoData,
  };
};

type cvickoId = "apollo" | "lafranconi" | "most-snp" | "nabrezie" | "promenada" | "tyrsak";

export const getCvickoIdFromQuery = (): cvickoId => {
  const cvickoQuery = new URLSearchParams(window.location.search).get("cvicko");
  switch (cvickoQuery) {
    case "apollo":
    case "lafranconi":
    case "most-snp":
    case "nabrezie":
    case "promenada":
    case "tyrsak":
      return cvickoQuery;
    default:
      return "apollo";
  }
};
