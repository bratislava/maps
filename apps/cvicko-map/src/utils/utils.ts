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
