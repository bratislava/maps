/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface ILocationProps extends IIconComponentProps {
    className?: string;
    isActive?: boolean;
}
export declare const Location: ({ size: inputSize, direction, className, isActive, }: ILocationProps) => JSX.Element;
