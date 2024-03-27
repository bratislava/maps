import { Feature, LineString as GeoJsonLineString } from 'geojson';
export interface AnimationChangeEvent {
    value: number;
    center: {
        lat: number;
        lng: number;
    };
}
export interface ILineStringProps {
    id: string;
    styles: any;
    isVisible?: boolean;
    coordinates: Feature<GeoJsonLineString>['geometry']['coordinates'];
    visiblePart?: number;
    initialVisiblePart?: number;
    duration?: number;
    onAnimationDone?: () => void;
    onAnimationChange?: (event: AnimationChangeEvent) => void;
}
export declare const LineString: ({ id, styles, coordinates, isVisible, visiblePart, initialVisiblePart, duration, onAnimationDone, onAnimationChange, }: ILineStringProps) => any;
