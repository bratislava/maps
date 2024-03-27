import { ReactNode } from 'react';
import { SnapPoint } from '../types';
export type SheetContext = {
    isOpen: boolean;
    currentHeight: number;
};
export declare const sheetContext: import("react").Context<SheetContext>;
export type SheetRef = {
    snapTo: (index: number) => void;
};
export type SheetProps = {
    isOpen?: boolean;
    snapPoints?: SnapPoint[];
    defaultSnapPoint?: number;
    children?: ReactNode;
    onClose?: () => void;
    className?: string;
    onSnapChange?: (event: {
        snapIndex: number;
        snapHeight: number;
    }) => void;
    hideHeader?: boolean;
};
export declare const Sheet: import("react").ForwardRefExoticComponent<SheetProps & import("react").RefAttributes<SheetRef>>;
