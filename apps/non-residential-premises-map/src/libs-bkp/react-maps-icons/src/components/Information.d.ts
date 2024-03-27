/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface IInformationProps extends IIconComponentProps {
    className?: string;
}
export declare const Information: ({ size: inputSize, direction, className, }: IInformationProps) => JSX.Element;
