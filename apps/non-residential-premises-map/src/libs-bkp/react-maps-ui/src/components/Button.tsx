import { useRef } from "react";
import { AriaButtonProps, useButton } from "react-aria";
import cx from "classnames";

export type ButtonProps = {
  className?: string;
} & AriaButtonProps<"button">;

export const Button = (props: ButtonProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { buttonProps } = useButton(props, ref);
  const { className } = props;
  return (
    <button {...buttonProps} ref={ref} className={className}>
      {props.children}
    </button>
  );
};
