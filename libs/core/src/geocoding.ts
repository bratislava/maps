import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Geocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapbox = mapboxgl;

export const forwardGeocode = async (
  mapboxgl: typeof mapbox,
  query: string
) => {
  const geocodingClient = Geocoding({
    accessToken: mapboxgl.accessToken,
  });

  if (query.length >= 2) {
    return geocodingClient
      .forwardGeocode({
        query,
        countries: ['sk'],
        language: ['sk'],
        types: [
          'address',
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
      .then((response: any) => {
        return response?.body?.features ?? [];
      });
  } else {
    return [];
  }
};
