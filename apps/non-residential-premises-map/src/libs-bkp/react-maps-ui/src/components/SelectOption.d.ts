import { ReactNode } from "react";
export interface ISelectOptionProps {
    value: string;
    children?: ReactNode;
}
export declare const SelectOption: ({ value, children }: ISelectOptionProps) => JSX.Element;
