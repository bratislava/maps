import { Feature } from "geojson";
export type AnyExp = ["any", ...any[]];
export declare const any: (exp: AnyExp, f: Feature, evaluate: (value: any, f: Feature) => any) => boolean;
