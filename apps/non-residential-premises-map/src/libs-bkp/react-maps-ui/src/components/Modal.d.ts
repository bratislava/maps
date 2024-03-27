import { ReactNode } from "react";
export interface IModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    title?: string | ReactNode;
    description?: string | ReactNode;
    children?: ReactNode;
    closeButtonIcon?: ReactNode;
    closeButtonOut?: boolean;
    closeButtonInCorner?: boolean;
    noOverlayStyles?: boolean;
    underlayClassName?: string;
    overlayClassName?: string;
    hideCloseButtonIcon?: boolean;
}
export declare const Modal: ({ isOpen, onClose, title, description, children, closeButtonIcon, closeButtonOut, closeButtonInCorner, noOverlayStyles, underlayClassName, overlayClassName, hideCloseButtonIcon, }: IModalProps) => JSX.Element;
