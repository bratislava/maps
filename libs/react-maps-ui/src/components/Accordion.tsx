import {
  Root,
  AccordionSingleProps,
  AccordionMultipleProps,
} from "@radix-ui/react-accordion";
import cx from "classnames";

export type IAccordionProps = (
  | AccordionSingleProps
  | AccordionMultipleProps
) & {
  children: React.ReactNode;
  className?: string;
};

export const Accordion = ({
  children,
  className,
  ...rest
}: IAccordionProps) => {
  return (
    //  https://github.com/radix-ui/primitives/issues/2309 not yet resolved
    //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Root className={cx("flex flex-col", className)} {...rest}>
      {children}
    </Root>
  );
};

export default Accordion;
