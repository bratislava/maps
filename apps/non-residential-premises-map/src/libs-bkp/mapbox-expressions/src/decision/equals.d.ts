import { Feature } from "geojson";
export type EqualsExp = ["==", string, any];
export declare const equals: (exp: EqualsExp, f: Feature, evaluate: (value: any, f: Feature) => any) => boolean;
