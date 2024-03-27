/// <reference types="react" />
export interface ISelectValueRendererProps {
    values: string[];
    placeholder: string;
    multiplePlaceholder: string;
    singlePlaceholder?: string;
}
export declare const SelectValueRenderer: ({ values, placeholder, multiplePlaceholder, singlePlaceholder, }: ISelectValueRendererProps) => JSX.Element;
