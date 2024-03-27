/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface IPlusProps extends IIconComponentProps {
    className?: string;
}
export declare const Plus: ({ size: inputSize, direction, className, }: IPlusProps) => JSX.Element;
