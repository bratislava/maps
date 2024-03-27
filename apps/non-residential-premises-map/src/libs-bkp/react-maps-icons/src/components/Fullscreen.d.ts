/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface IFullscreenProps extends IIconComponentProps {
    className?: string;
    isFullscreen?: boolean;
}
export declare const Fullscreen: ({ size: inputSize, direction, className, isFullscreen, }: IFullscreenProps) => JSX.Element;
