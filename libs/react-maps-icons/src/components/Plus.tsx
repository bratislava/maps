import React from "react";
import { IIconComponentProps } from "../types";
import { useIconParams } from "../hooks/useIconParams";

export interface IPlusProps extends IIconComponentProps {
  className?: string;
}

export const Plus = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: IPlusProps) => {
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
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          x1="2"
          y1="10"
          x2="18"
          y2="10"
        />
        <line
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          x1="10"
          y1="18"
          x2="10"
          y2="2"
        />
      </svg>
    </div>
  );
};
