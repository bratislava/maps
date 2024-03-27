export declare const DEFAULT_STROKE_SIZE = 1.5;
export declare const SIZES: {
    xs: number;
    sm: number;
    default: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
};
export declare const DIRECTIONS_STYLES: {
    right: {
        transform: string;
    };
    bottom: {
        transform: string;
    };
    left: {
        transform: string;
    };
    top: {
        transform: string;
    };
};
export type IconSize = "xs" | "sm" | "default" | "md" | "lg" | "xl" | "xxl";
export type Direction = "right" | "bottom" | "left" | "top";
export interface IIconComponentProps {
    size?: IconSize;
    direction?: Direction;
}
