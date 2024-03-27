import { Feature } from "geojson";
export type GteExp = [">=", string, any];
export declare const gte: (exp: GteExp, f: Feature, evaluate: (value: any, f: Feature) => any) => boolean;
