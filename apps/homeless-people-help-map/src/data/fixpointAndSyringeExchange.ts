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
      // id needs to be different for each Marker on map otherwise it will interact with each other
      // https://github.com/bratislava/private-maps/issues/14#issuecomment-2003846920
      id: "fixpoints-" + fixpoint.id,
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
