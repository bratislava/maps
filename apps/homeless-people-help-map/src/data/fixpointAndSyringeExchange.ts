/* eslint-disable camelcase */
import { FeatureCollection, Point } from "geojson";
import { useFixpointyQuery } from "../../graphql";
import { useTranslation } from "react-i18next";

export const useFixpointAndSyringeExchange = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, error } = useFixpointyQuery({ locale: i18n.language });

  const processedFeatures = data?.fixpoints?.data.map((fixpoint) => {
    // convert to fixpointAndSyringeExchangeData type
    return {
      id: fixpoint.id,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [fixpoint.attributes?.Longitude, fixpoint.attributes?.Latitude],
      },
      properties: {
        name: fixpoint.attributes?.Nazov || "",
        address: fixpoint.attributes?.Adresa || "",
        icon: "fixpointAndSyringeExchange",
      },
    };
  });
  return {
    data:
      data &&
      ({
        type: "FeatureCollection",
        features: processedFeatures,
      } as FeatureCollection<Point>),
    isLoading,
    error,
  };
};

// old static data - todo remove
export const fixpointAndSyringeExchangeData: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: [
    {
      id: 1,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.2047938957964, 48.139113792786425] },
      properties: {
        name_sk: "Fixpoint a výmena striekačiek",
        name_en: "Fixpoint and syringe exchange",
        address_sk: "Stavbárska 40",
        address_en: "Stavbárska 40",
        icon: "fixpointAndSyringeExchange",
      },
    },
    {
      id: 2,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.20034470452467, 48.13854511601718] },
      properties: {
        name_sk: "Fixpoint",
        name_en: "Fixpoint",
        address_sk: "Lotyšská 30 - okolie",
        address_en: "Lotyšská 30 - surrounding locality",
        icon: "fixpoint",
      },
    },
    {
      id: 3,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.126615481698423, 48.157910323937394] },
      properties: {
        name_sk: "Výmena striekačiek",
        name_en: "Syringe exchange",
        address_sk: "Trnavské mýto - pri Tržnici",
        address_en: "Trnavské mýto - near Market Hall",
        icon: "syringeExchange",
      },
    },
    {
      id: 4,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.09059663997174, 48.113107011662926] },
      properties: {
        name_sk: "Fixpoint",
        name_en: "Fixpoint",
        address_sk: "Kopčianska 88",
        address_en: "Kopčianska 88",
        icon: "fixpoint",
      },
    },
    {
      id: 5,
      type: "Feature",
      geometry: { type: "Point", coordinates: [17.093196663973917, 48.11539765497697] },
      properties: {
        name_sk: "Výmena striekačiek",
        name_en: "Syringe exchange",
        address_sk: "Kopčianska 22 - okolie",
        address_en: "Kopčianska 22 - surrounding locality",
        icon: "syringeExchange",
      },
    },
  ],
};
