import { ReactNode } from 'react';
type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'right' | 'left';
type Positon = VerticalPosition | HorizontalPosition | `${VerticalPosition}-${HorizontalPosition}`;
export interface ISlotProps {
    id: string;
    children?: ReactNode;
    isVisible?: boolean;
    position?: Positon;
    hidingEdge?: VerticalPosition | HorizontalPosition;
    autoPadding?: boolean;
    className?: string;
    avoidMapboxControls?: boolean;
    persistChildrenWhenClosing?: boolean;
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}
export declare const Slot: ({ id, children, isVisible, position, hidingEdge, autoPadding, className, avoidMapboxControls, padding, persistChildrenWhenClosing, }: ISlotProps) => JSX.Element;
export {};
