type CvickoId = "apollo" | "lafranconi" | "most-snp" | "nabezie" | "promenada" | "tyrsak";

export const getCvickoIdFromQuery = (query: string | null): CvickoId | null => {
  switch (query) {
    case "apollo":
    case "lafranconi":
    case "most-snp":
    case "nabezie":
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
