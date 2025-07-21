import { FeatureCollection, Point } from "geojson";
import { useArcgis } from "@bratislava/react-use-arcgis";
import { PUBLIC_TOILETS_URL } from "../utils/urls";

export const usePublicToilets = () => {
  const { data: rawPublicToiletsData } = useArcgis(PUBLIC_TOILETS_URL, { format: "geojson" });

  const processedFeatures = rawPublicToiletsData?.features.map((publicToilet) => {
    const geometry = publicToilet.geometry as Point;
    return {
      // id needs to be different for each Marker on map otherwise it will interact with each other
      // https://github.com/bratislava/private-maps/issues/14#issuecomment-2003846920
      id: "toilet-" + publicToilet.id,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: geometry.coordinates,
      },
      properties: {
        price: publicToilet.properties?.cena,
        name: publicToilet.properties?.miesto_nazov,
        objectid: publicToilet.properties?.objectid,
        openingHours: publicToilet.properties?.otvaracia_doba,
        maintainer: publicToilet.properties?.spravuje,
        latitude: publicToilet.properties?.zemepisna_dlzka,
        longitude: publicToilet.properties?.zemepisna_sirka,
      },
    };
  });
  return {
    data:
      rawPublicToiletsData &&
      ({
        type: "FeatureCollection",
        features: processedFeatures,
      } as FeatureCollection<Point>),
  };
};
