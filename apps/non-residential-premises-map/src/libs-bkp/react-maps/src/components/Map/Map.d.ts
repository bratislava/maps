import { Dispatch, MutableRefObject } from 'react';
import '../../styles/mapbox-corrections.css';
import { IMapState, MapAction } from './mapReducer';
import { MapMethods, MapProps } from './types';
export type MapHandle = MapMethods;
export interface IMapContext {
    mapboxAccessToken: string;
    mapState: IMapState | null;
    dispatchMapState: Dispatch<MapAction> | null;
    containerRef: MutableRefObject<HTMLDivElement | null> | null;
    isMobile: boolean | null;
    methods: MapMethods;
}
export declare const mapContext: import("react").Context<IMapContext>;
export declare const Map: import("react").ForwardRefExoticComponent<Omit<MapProps, "prevI18n"> & import("react").RefAttributes<MapMethods>>;
