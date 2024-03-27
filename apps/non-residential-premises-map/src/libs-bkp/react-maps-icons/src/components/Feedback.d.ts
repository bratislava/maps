/// <reference types="react" />
import { IIconComponentProps } from "../types";
export interface IFeedbackProps extends IIconComponentProps {
    className?: string;
}
export declare const Feedback: ({ size: inputSize, direction, className, }: IFeedbackProps) => JSX.Element;
