import { Feature } from "geojson";
export type LteExp = ["<=", string, any];
export declare const lte: (exp: LteExp, f: Feature, evaluate: (value: any, f: Feature) => any) => boolean;
