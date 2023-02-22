import cx from "classnames";
import { HTMLProps } from "react";

export const Input = ({
  className,
  ...props
}: Omit<HTMLProps<HTMLInputElement>, "capture">) => (
  <input
    className={cx(
      "bg-background-lightmode dark:bg-background-darkmode placeholder:text-foreground-lightmode placeholder:dark:text-foreground-darkmode border-[1px] font-medium placeholder:font-medium border-gray-lightmode dark:border-gray-darkmode border-opacity-10 dark:border-opacity-20 h-12 rounded-lg px-3 outline-none focus:border-primary focus:border-opacity-100 focus:dark:border-primary transition-all",
      className
    )}
    {...props}
  />
);

export default Input;
