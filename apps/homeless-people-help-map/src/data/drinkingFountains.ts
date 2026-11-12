import { FeatureCollection, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { usePitneFontankyQuery } from "../../graphql";

export const useDrinkingFountains = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, error } = usePitneFontankyQuery({ locale: i18n.language });

  const processedFeatures = data?.pitneFontankies.map((fountain) => {
    return {
      // id needs to be different for each Marker on map otherwise it will interact with each other
      // https://github.com/bratislava/private-maps/issues/14#issuecomment-2003846920
      id: "fountain-" + fountain?.documentId,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [fountain?.Longitude, fountain?.Latitude],
      },
      properties: {
        // Strapi 5 types list items as nullable; drop nulls so the detail schema parses
        photo: fountain?.Fotky?.filter(Boolean) ?? [],
        latitude: fountain?.Latitude || "",
        longitude: fountain?.Longitude || "",
        name: fountain?.Nazov || "",
        buildSince: fountain?.Rok_spustenia || "",
        maintainer: fountain?.Spravca || "",
        state: fountain?.Stav || "",
        type: fountain?.Typ || "",
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
