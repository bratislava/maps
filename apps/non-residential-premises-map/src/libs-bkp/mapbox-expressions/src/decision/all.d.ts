import { Feature } from "geojson";
export type AllExp = ["all", ...any[]];
export declare const all: (exp: AllExp, f: Feature, evaluate: (value: any, f: Feature) => any) => boolean;
