/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface IChevronProps extends IIconComponentProps {
    className?: string;
}
export declare const Chevron: ({ size: inputSize, direction, className, }: IChevronProps) => JSX.Element;
