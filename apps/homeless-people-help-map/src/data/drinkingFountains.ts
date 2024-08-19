import { FeatureCollection, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { usePitneFontankyQuery } from "../../graphql";

export const useDrinkingFountains = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, error } = usePitneFontankyQuery({ locale: i18n.language });

  const processedFeatures = data?.pitneFontankies?.data.map((fountain) => {
    // convert to fixpointAndSyringeExchangeData type
    return {
      // id needs to be different for each Marker on map otherwise it will interact with each other
      // https://github.com/bratislava/private-maps/issues/14#issuecomment-2003846920
      id: "fountain-" + fountain.id,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [fountain.attributes?.Longitude, fountain.attributes?.Latitude],
      },
      properties: {
        photo: fountain.attributes?.Fotky || "",
        latitude: fountain.attributes?.Latitude || "",
        longitude: fountain.attributes?.Longitude || "",
        name: fountain.attributes?.Nazov || "",
        buildSince: fountain.attributes?.Rok_spustenia || "",
        maintainer: fountain.attributes?.Spravca || "",
        state: fountain.attributes?.Stav || "",
        type: fountain.attributes?.Typ || "",
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
