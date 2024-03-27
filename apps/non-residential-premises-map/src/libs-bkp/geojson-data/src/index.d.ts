import { FeatureCollection, Point, Polygon } from "@turf/helpers";
export declare const ADDRESSES_GEOJSON: FeatureCollection<Point, {
    name: string;
    number: string;
    id: string;
}>;
export declare const DISTRICTS_GEOJSON: FeatureCollection<Polygon, {
    name: string;
    district: string;
}>;
