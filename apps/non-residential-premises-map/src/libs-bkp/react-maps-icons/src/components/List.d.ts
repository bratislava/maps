/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface IListProps extends IIconComponentProps {
    className?: string;
}
export declare const List: ({ size: inputSize, direction, className, }: IListProps) => JSX.Element;
