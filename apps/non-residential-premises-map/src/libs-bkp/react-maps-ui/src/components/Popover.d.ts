import { Placement } from '@floating-ui/react';
import { FC, ReactNode } from "react";
export interface IPopoverProps {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    button: FC<{
        isOpen: boolean;
        open: () => void;
        close: () => void;
        toggle: () => void;
    }> | ReactNode;
    panel: ReactNode;
    isSmall?: boolean;
    allowedPlacements?: Placement[];
    className?: string;
}
export declare const Popover: ({ button: Button, panel, isSmall, allowedPlacements, isOpen: isOpenExternal, onOpenChange, className, }: IPopoverProps) => JSX.Element;
