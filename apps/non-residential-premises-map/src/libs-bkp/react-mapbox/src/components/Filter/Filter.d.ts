import { Feature } from "geojson";
import { ReactNode } from "react";
export interface IFilterProps {
    expression?: any;
    children?: ReactNode;
}
export interface IFilterContext {
    expression: any;
    isFeatureVisible?: (feature: Feature) => boolean;
}
export declare const filterContext: import("react").Context<IFilterContext>;
export declare const Filter: ({ expression, children }: IFilterProps) => JSX.Element;
