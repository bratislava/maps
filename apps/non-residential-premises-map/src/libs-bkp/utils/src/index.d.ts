import { Season } from "./types";
import { Feature } from "geojson";
export * from "./hooks/usePrevious";
export * from "./hooks/useEffectDebugger";
export declare const getSeasonFromDate: (input: number | string | Date) => Season | null;
export declare const getRandomItemFrom: <T>(items: T | T[]) => T;
export declare const getUniqueValuesFromFeatures: (features: Feature[], property: string) => string[];
export declare function isDefined<T>(value: T | undefined | null): value is T;
