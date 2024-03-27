export const DEFAULT_STROKE_SIZE = 1.5;

export const SIZES = {
  xs: 12,
  sm: 16,
  default: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 40,
};

export const DIRECTIONS_STYLES = {
  right: {
    transform: "rotate(90deg)",
  },
  bottom: {
    transform: "rotate(180deg)",
  },
  left: {
    transform: "rotate(-90deg)",
  },
  top: {
    transform: "rotate(0)",
  },
};

export type IconSize = "xs" | "sm" | "default" | "md" | "lg" | "xl" | "xxl";

export type Direction = "right" | "bottom" | "left" | "top";

export interface IIconComponentProps {
  size?: IconSize;
  direction?: Direction;
}
