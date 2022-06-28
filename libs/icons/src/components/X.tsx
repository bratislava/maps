import React from "react";
import { IIconComponentProps } from "../types";
import { useIconParams } from "../hooks/useIconParams";

export interface IXProps extends IIconComponentProps {
  className?: string;
}

export const X = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: IXProps) => {
  const { strokeWidth, size, style } = useIconParams(inputSize, direction);

  return (
    <div className={className}>
      <svg
        style={style}
        width={size}
        height={size}
        viewBox={`0 0 20 20`}
        fill="none"
      >
        <line
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          x1="2"
          y1="2"
          x2="18"
          y2="18"
        />
        <line
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          x1="18"
          y1="2"
          x2="2"
          y2="18"
        />
      </svg>
    </div>
  );
};
