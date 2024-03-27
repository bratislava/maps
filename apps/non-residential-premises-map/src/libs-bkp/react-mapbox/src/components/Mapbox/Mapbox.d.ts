import mapboxgl, { MapboxGeoJSONFeature } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactNode } from 'react';
import { PartialViewport, Viewport } from '../../types';
export interface MapboxGesturesOptions {
    disableBearing?: boolean;
    disablePitch?: boolean;
}
export interface MapboxProps extends MapboxGesturesOptions {
    mapboxAccessToken: string;
    isDarkmode?: boolean;
    isSatellite?: boolean;
    mapStyles?: {
        [key: string]: string;
    };
    selectedFeatures?: MapboxGeoJSONFeature[];
    onFeaturesClick?: (features: MapboxGeoJSONFeature[]) => void;
    children?: ReactNode;
    layerPrefix?: string;
    onViewportChange?: (viewport: Viewport) => void;
    onViewportChangeDebounced?: (viewport: Viewport) => void;
    onLoad?: () => void;
    initialViewport?: PartialViewport;
    isDevelopment?: boolean;
    onClick?: (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => void;
    maxBounds?: [[number, number], [number, number]];
    maxZoom?: number;
    minZoom?: number;
    cooperativeGestures?: boolean;
    locale?: {
        [key: string]: string;
    };
    interactive?: boolean;
}
export interface ISlotPadding {
    isVisible: boolean;
    padding: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    name: string;
    avoidControls: boolean;
}
export interface IContext {
    map: mapboxgl.Map | null;
    isLoading: boolean;
    isStyleLoading: boolean;
    getPrefixedLayer: (layerId: string) => string;
    isLayerPrefixed: (layerId: string) => boolean;
    addClickableLayer: (layerId: string) => void;
    changeViewport: (viewport: PartialViewport, duration?: number) => void;
    layerPrefix: string;
}
export declare const mapboxContext: import("react").Context<IContext>;
export type MapboxHandle = {
    changeViewport: (viewport: PartialViewport, duration?: number) => void;
    fitBounds: (bounds: mapboxgl.LngLatBoundsLike, options?: mapboxgl.FitBoundsOptions) => void;
};
export declare const Mapbox: import("react").ForwardRefExoticComponent<MapboxProps & import("react").RefAttributes<MapboxHandle>>;
export default Mapbox;
