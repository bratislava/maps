import Geocoding, {
  GeocodeFeature as MapboxGeocodeFeature,
} from "@mapbox/mapbox-sdk/services/geocoding";

export type GeocodeFeature = MapboxGeocodeFeature;

export const forwardGeocode = async (
  mapboxAccessToken: string,
  query: string
): Promise<GeocodeFeature[]> => {
  const geocodingClient = Geocoding({
    accessToken: mapboxAccessToken,
  });

  if (query.length >= 2) {
    return geocodingClient
      .forwardGeocode({
        query,
        countries: ["sk"],
        language: ["sk"],
        types: [
          "address",
          // 'district',
          // 'locality',
          // 'place',
          // 'poi',
          // 'neighborhood',
          // 'poi.landmark',
        ],
        limit: 8,
        bbox: [16.9932, 48.0967, 17.2051, 48.2082],
      })
      .send()
      .then((response) => {
        return response.body.features ?? [];
      });
  } else {
    return [];
  }
};
