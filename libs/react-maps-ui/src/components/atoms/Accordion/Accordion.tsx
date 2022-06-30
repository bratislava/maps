import React, { ReactNode } from "react";
import cx from "classnames";
import { Root } from "@radix-ui/react-accordion";

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
