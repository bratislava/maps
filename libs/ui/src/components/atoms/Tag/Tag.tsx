import React, { ReactNode, useEffect, useState } from "react";
import cx from "classnames";

export interface ITagProps {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  isSmall?: boolean;
}

export const Tag = ({
  className = "",
  onClick,
  children,
  isSmall = false,
}: ITagProps) => {
  return (
    <div
      className={cx(
        "rounded  select-none",
        {
          "bg-gray bg-opacity-10": !className.includes("bg-"),
          "px-3 py-1": !isSmall,
          "px-2": isSmall,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
