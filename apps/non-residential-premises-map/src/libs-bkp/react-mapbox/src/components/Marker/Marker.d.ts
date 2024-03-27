import { Feature, Point } from 'geojson';
import { MouseEvent, ReactNode } from 'react';
export interface IMarkerProps {
    children?: ReactNode;
    feature: Feature<Point>;
    isRelativeToZoom?: boolean;
    baseZoom?: number;
    scalePercentMultiplier?: number;
    className?: string;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    ignoreFilters?: boolean;
    origin?: 'top' | 'right' | 'bottom' | 'left' | 'center';
    zIndex?: number;
}
export declare const Marker: ({ children, feature, isRelativeToZoom, baseZoom, scalePercentMultiplier, className, onClick, ignoreFilters, origin, zIndex, }: IMarkerProps) => import("react").ReactPortal;
