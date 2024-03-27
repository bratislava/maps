/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface IFunnelProps extends IIconComponentProps {
    className?: string;
}
export declare const Funnel: ({ size: inputSize, direction, className, }: IFunnelProps) => JSX.Element;
