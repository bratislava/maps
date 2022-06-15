import React, { ReactNode, useEffect, useState } from "react";
import cx from "classnames";

export interface ITagProps {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

export const Tag = ({ className = "", onClick, children }: ITagProps) => {
  return (
    <div
      className={cx(
        "rounded px-3 py-1 select-none",
        {
          "bg-gray bg-opacity-10": !className.includes("bg-"),
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
