import { ReactNode } from "react";
export interface INoteProps {
    children: ReactNode;
    className?: string;
}
export declare const Note: ({ children, className }: INoteProps) => JSX.Element;
