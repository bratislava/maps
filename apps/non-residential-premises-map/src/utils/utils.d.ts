import { FeatureCollection } from "geojson";
export declare const processData: (rawData: FeatureCollection) => {
    data: FeatureCollection<import("geojson").Geometry, {
        [name: string]: any;
    }>;
    uniqueDistricts: string[];
    uniqueOccupancies: string[];
    uniquePurposes: string[];
    uniqueStreets: string[];
};
