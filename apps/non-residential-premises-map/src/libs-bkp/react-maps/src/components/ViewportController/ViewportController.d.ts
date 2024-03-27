import { ReactNode } from 'react';
export type SlotType = 'legend' | 'geolocation' | 'compass' | 'zoom' | 'fullscreen' | SlotType[];
interface ViewportControllerProps {
    className?: string;
    slots?: SlotType[];
    desktopSlots?: SlotType[];
    legend?: ReactNode;
    isLegendOpen?: boolean;
    onLegendOpenChange?: (isVisible: boolean) => void;
}
export declare const ViewportController: import("react").ForwardRefExoticComponent<ViewportControllerProps & import("react").RefAttributes<HTMLDivElement>>;
export {};
