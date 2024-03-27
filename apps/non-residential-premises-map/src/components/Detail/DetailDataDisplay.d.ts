/// <reference types="react" />
import { Feature } from "geojson";
export interface IDetailDataDisplayProps {
    feature: Feature;
    className?: string;
    isSingleFeature?: boolean;
}
export type TOccupacy = "forRent" | "occupied" | "free" | "other";
export declare const DetailDataDisplay: ({ feature, className, isSingleFeature, }: IDetailDataDisplayProps) => JSX.Element;
