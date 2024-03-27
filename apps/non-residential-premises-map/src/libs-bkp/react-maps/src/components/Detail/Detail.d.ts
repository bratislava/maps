import { ReactNode } from 'react';
import { SnapPoint } from '@bratislava/react-framer-motion-bottom-sheet';
export type DetailProps = {
    children?: ReactNode;
    isBottomSheet?: boolean;
    bottomSheetSnapPoints?: SnapPoint[];
    bottomSheetInitialSnap?: number;
    onClose: () => void;
    isVisible?: boolean;
    onBottomSheetSnapChange?: (index: number) => void;
    hideBottomSheetHeader?: boolean;
    avoidMapboxControls?: boolean;
};
export declare const Detail: import("react").ForwardRefExoticComponent<DetailProps & import("react").RefAttributes<SheetHandle>>;
