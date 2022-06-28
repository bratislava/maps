import cx from "classnames";
import React from "react";

interface IInputProps {
  hasError?: boolean;
  className: string;
}

export const Input = ({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  IInputProps) => (
  <input
    className={cx(
      "bg-white border-2 border-gray border-opacity-10 h-12 rounded-lg px-3 outline-none focus:border-primary focus:border-opacity-100 transition-all",
      className
    )}
    {...props}
  />
);

export default Input;
