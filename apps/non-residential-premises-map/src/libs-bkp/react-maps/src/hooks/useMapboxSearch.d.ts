/// <reference types="mapbox__mapbox-sdk" />
import { BoundingBox, GeocodeQueryType } from '@mapbox/mapbox-sdk/services/geocoding';
export interface IUseMapboxSearchOptions {
    mapboxAccessToken: string;
    searchQuery: string;
    language: string;
    types?: GeocodeQueryType[];
    limit?: number;
    bbox?: BoundingBox;
}
export declare const useMapboxSearch: ({ mapboxAccessToken, searchQuery, language, types, limit, bbox, }: IUseMapboxSearchOptions) => {
    results: import("@mapbox/mapbox-sdk/services/geocoding").GeocodeFeature[];
    error: any;
};
