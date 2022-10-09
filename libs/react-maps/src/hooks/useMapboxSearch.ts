import Geocoding, {
  BoundingBox,
  GeocodeQueryType,
} from '@mapbox/mapbox-sdk/services/geocoding';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useDebounce } from 'usehooks-ts';

type ForwardGeocodeRequestOptions = {
  countries: string[];
  types: GeocodeQueryType[];
  limit: number;
  bbox: BoundingBox;
};

const DEFAULT_FORWARD_GEOCODE_REQUEST_OPTIONS: ForwardGeocodeRequestOptions = {
  countries: ['sk'], // Slovakia only
  types: ['address', 'poi'], // addresses and point of interests only
  limit: 10, // 10 results max
  bbox: [16.9932, 48.0967, 17.2051, 48.2082], // bbox of Bratislava,
};

export interface IUseMapboxSearchOptions {
  mapboxAccessToken: string;
  searchQuery: string;
  language: string;
  types?: GeocodeQueryType[];
  limit?: number;
  bbox?: BoundingBox;
}

export const useMapboxSearch = ({
  mapboxAccessToken,
  searchQuery,
  language,
  types = DEFAULT_FORWARD_GEOCODE_REQUEST_OPTIONS.types,
  limit = DEFAULT_FORWARD_GEOCODE_REQUEST_OPTIONS.limit,
  bbox = DEFAULT_FORWARD_GEOCODE_REQUEST_OPTIONS.bbox,
}: IUseMapboxSearchOptions) => {
  const mapboxGeocodingClient = useMemo(
    () =>
      Geocoding({
        accessToken: mapboxAccessToken,
      }),
    [mapboxAccessToken]
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, error } = useSWR(debouncedSearchQuery, async (query) => {
    // if query is too short
    if (query.length <= 1) {
      return [];
    }

    return mapboxGeocodingClient
      .forwardGeocode({
        query,
        language: [language],
        types,
        limit,
        bbox,
      })
      .send()
      .then((res) => res.body.features);
  });

  return {
    results: data,
    error,
  };
};
