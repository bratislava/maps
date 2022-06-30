import React, { ReactNode } from "react";
import cx from "classnames";

interface IconButtonProps {
  children: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  isMobileOnly?: boolean;
  isDektopOnly?: boolean;
  noStyle?: boolean;
  className?: string;
  noAnimation?: boolean;
}

export const IconButton = ({
  children,
  onClick,
  isActive,
  isDisabled,
  isMobileOnly,
  isDektopOnly,
  noStyle = false,
  className,
  noAnimation = false,
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
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default IconButton;
