/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface IEyeProps extends IIconComponentProps {
    className?: string;
    isCrossed?: boolean;
}
export declare const Eye: ({ size: inputSize, direction, className, isCrossed, }: IEyeProps) => JSX.Element;
