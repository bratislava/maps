import {
  Root,
  AccordionSingleProps,
  AccordionMultipleProps,
} from "@radix-ui/react-accordion";
import cx from "classnames";

export type IAccordionProps = AccordionSingleProps | AccordionMultipleProps;

export const Accordion = ({
  children,
  className,
  ...rest
}: IAccordionProps) => {
  return (
    <Root className={cx("flex flex-col", className)} {...rest}>
      {children}
    </Root>
  );
};

export default Accordion;
