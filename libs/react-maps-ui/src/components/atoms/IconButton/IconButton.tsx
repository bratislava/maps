import React, { HTMLProps, ReactNode } from "react";
import cx from "classnames";

interface IconButtonProps extends HTMLProps<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  isMobileOnly?: boolean;
  isDektopOnly?: boolean;
  noStyle?: boolean;
  noAnimation?: boolean;
  type?: "button" | "submit" | "reset";
}

export const IconButton = ({
  children,
  isActive,
  isDisabled,
  isMobileOnly,
  isDektopOnly,
  noStyle = false,
  className,
  noAnimation = false,
  ...etc
}: IconButtonProps) => {
  return (
    <button
      className={cx(
        "flex text-font items-center justify-center pointer-events-auto",
        {
          "transform active:scale-75 transition-all": !noAnimation,
          "shadow-lg bg-background-lightmode dark:bg-background-darkmode rounded-lg border-2 border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20 w-12 h-12":
            !noStyle,
          "w-11 h-11": noStyle,
        },
        {
          "text-primary": isActive,
          "opacity-50": isDisabled,
          "hidden lg:flex": isDektopOnly,
          "lg:hidden": isMobileOnly,
        },
        className
      )}
      {...etc}
    >
      {children}
    </button>
  );
};

export default IconButton;
