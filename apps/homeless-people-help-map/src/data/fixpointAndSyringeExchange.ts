import { FeatureCollection, Point } from "geojson";

export const fixpointAndSyringeExchangeData: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: [
    {
      id: 1,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.2047938957964, 48.139113792786425] },
      properties: {
        name: "Fixpoint a výmena striekačiek",
        address: "Stavbárska 40",
        icon: "fixpointAndSyringeExchange",
      },
    },
    {
      id: 2,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.20034470452467, 48.13854511601718] },
      properties: {
        name: "Fixpoint",
        address: "Lotyšská 30 - okolie",
        icon: "fixpoint",
      },
    },
    {
      id: 3,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.126615481698423, 48.157910323937394] },
      properties: {
        name: "Výmena striekačiek",
        address: "Trnavské mýto - pri Tržnici",
        icon: "syringeExchange",
      },
    },
    {
      id: 4,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.09059663997174, 48.113107011662926] },
      properties: {
        name: "Fixpoint",
        address: "Kopčianska 88",
        icon: "fixpoint",
      },
    },
    {
      id: 5,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.093196663973917, 48.11539765497697] },
      properties: {
        name: "Výmena striekačiek",
        address: "Kopčianska 22 - okolie",
        icon: "syringeExchange",
      },
    },
  ],
};
