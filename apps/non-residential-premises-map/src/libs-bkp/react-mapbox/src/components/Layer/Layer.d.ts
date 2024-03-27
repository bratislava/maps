import { FeatureCollection } from '../../../../../libs/utils/src/types';
import { Feature } from 'geojson';
import { FC, ReactNode } from 'react';
type Filter = string | null | boolean | Filter[];
export interface ILayerProps {
    geojson: FeatureCollection | Feature | null;
    styles: any;
    isVisible?: boolean;
    hidePopup?: boolean;
    filters?: Filter[];
    ignoreFilters?: boolean;
    ignoreClick?: boolean;
    hoverPopup?: FC<string> | ReactNode;
}
export declare const Layer: ({ geojson, styles, isVisible, hidePopup, filters, ignoreFilters, ignoreClick, hoverPopup, }: ILayerProps) => import("react").ReactPortal;
export {};
