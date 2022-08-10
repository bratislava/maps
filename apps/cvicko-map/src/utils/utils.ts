type CvickoId = "apollo" | "lanfranconi" | "most-snp" | "nabrezie" | "promenada" | "tyrsak";

export const getCvickoIdFromQuery = (query: string | null): CvickoId | null => {
  switch (query) {
    case "apollo":
    case "lanfranconi":
    case "most-snp":
    case "nabrezie":
    case "promenada":
    case "tyrsak":
      return query;
    default:
      return null;
  }
};

export const getIsHomepageFromQuery = (query: string | null): boolean => {
  if (query === "" || query) {
    return true;
  }
  return false;
};
