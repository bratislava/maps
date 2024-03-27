import { Feature } from "geojson";
export type GetExp = ["get", any];
export declare const get: (exp: GetExp, f: Feature, evaluate: (value: any, f: Feature) => any) => string | number | null;
