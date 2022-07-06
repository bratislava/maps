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
        "flex text-font w-12 h-12 items-center justify-center pointer-events-auto",
        {
          "transform active:scale-75 transition-transform": !noAnimation,
          "shadow-lg bg-background rounded-lg": !noStyle,
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
