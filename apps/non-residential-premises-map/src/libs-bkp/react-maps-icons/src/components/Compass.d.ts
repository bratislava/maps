/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface ICompassProps extends IIconComponentProps {
    className?: string;
}
export declare const Compass: ({ size: inputSize, direction, className, }: ICompassProps) => JSX.Element;
