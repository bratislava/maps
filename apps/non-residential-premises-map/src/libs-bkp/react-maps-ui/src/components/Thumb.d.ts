/// <reference types="react" />
import { SliderState } from "react-stately";
export interface IThumbProps {
    state: SliderState;
    trackRef: React.MutableRefObject<HTMLDivElement | null>;
    index: number;
    isActive?: boolean;
}
export declare const Thumb: (props: IThumbProps) => JSX.Element;
