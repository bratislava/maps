import { Feature } from "geojson";
export type InExp = ["in", string, string[]];
export declare const inside: (exp: InExp, f: Feature, evaluate: (value: any, f: Feature) => any) => boolean;
