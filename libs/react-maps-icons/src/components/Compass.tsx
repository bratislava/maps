import React from "react";
import { IIconComponentProps } from "../types";
import { useIconParams } from "../hooks/useIconParams";

export interface ICompassProps extends IIconComponentProps {
  className?: string;
}

export const Compass = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: ICompassProps) => {
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
        <path
          strokeWidth={strokeWidth}
          fill="currentColor"
          stroke="currentColor"
          strokeLinecap="round"
          d="M13,10.1l-3-8.9l-3,8.9H13z"
        />
        <path
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          d="M7,10.1l3,8.9l3-8.9"
        />
      </svg>
    </div>
  );
};
