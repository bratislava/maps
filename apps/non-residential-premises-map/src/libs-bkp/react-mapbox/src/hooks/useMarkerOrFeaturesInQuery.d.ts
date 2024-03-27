import { GeoJsonProperties, Geometry } from '../../../../libs/utils/src/types';
import { Feature, FeatureCollection, Point } from 'geojson';
export type useMarkerOrFeaturesInQueryOptions = {
    markersData: FeatureCollection | null;
    selectedMarker?: Feature<Point> | null;
    selectedFeatures?: Feature[];
    zoomAtWhichMarkerWasSelected: number | null;
    setSelectedMarkerAndZoom?: (feature: Feature<Point, GeoJsonProperties> | null, zoom: number | null) => void;
    setSelectedFeaturesAndZoom?: (features: Feature<Geometry, GeoJsonProperties>[] | null, zoom: number | null) => void;
};
export declare const useMarkerOrFeaturesInQuery: ({ markersData, selectedMarker, selectedFeatures, setSelectedMarkerAndZoom, setSelectedFeaturesAndZoom, zoomAtWhichMarkerWasSelected, }: useMarkerOrFeaturesInQueryOptions) => void;
