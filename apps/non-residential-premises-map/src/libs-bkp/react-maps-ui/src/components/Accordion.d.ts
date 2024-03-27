/// <reference types="react" />
import { AccordionSingleProps, AccordionMultipleProps } from "@radix-ui/react-accordion";
export type IAccordionProps = AccordionSingleProps | AccordionMultipleProps;
export declare const Accordion: ({ children, className, ...rest }: IAccordionProps) => JSX.Element;
export default Accordion;
