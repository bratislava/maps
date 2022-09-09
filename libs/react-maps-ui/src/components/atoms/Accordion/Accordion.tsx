import { Root } from "@radix-ui/react-accordion";
import cx from "classnames";
import { ReactNode } from "react";

export interface IAccordionProps {
  children?: ReactNode;
  className?: string;
}

export const Accordion = ({ children, className }: IAccordionProps) => {
  return (
    <Root type="multiple" className={cx("flex flex-col", className)}>
      {children}
    </Root>
  );
};

export default Accordion;
