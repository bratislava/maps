import React from "react";
import cx from "classnames";

export interface IDividerProps {
  className?: string;
}

export const Divider = ({ className }: IDividerProps) => {
  return (
    <div
      className={cx(
        "h-[2px] bg-gray-lightmode dark:bg-gray-darkmode opacity-20",
        className
      )}
    ></div>
  );
};
