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
}: IconButtonProps) => {
  return (
    <button
      className={cx(
        "flex text-font w-12 h-12 items-center justify-center pointer-events-auto",
        {
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
