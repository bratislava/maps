import { CSSProperties, ReactNode } from "react";
export interface IAccordionItemProps {
    value: string;
    title: string | ReactNode;
    children: ReactNode;
    rightSlot?: ReactNode;
    className?: string;
    isOpenable?: boolean;
    isActive?: boolean;
    paasDesign?: boolean;
    headerIsTrigger?: boolean;
    headerClassName?: string;
    style?: CSSProperties;
}
export declare const AccordionItem: ({ children, value, title, rightSlot, className, isActive, isOpenable, paasDesign, headerIsTrigger, headerClassName, style, }: IAccordionItemProps) => JSX.Element;
