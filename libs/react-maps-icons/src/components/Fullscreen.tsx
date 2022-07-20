import React from "react";
import { IIconComponentProps } from "../types";
import { useIconParams } from "../hooks/useIconParams";

export interface IFullscreenProps extends IIconComponentProps {
  className?: string;
  isFullscreen?: boolean;
}

export const Fullscreen = ({
  size: inputSize = "default",
  direction = "top",
  className,
  isFullscreen = false,
}: IFullscreenProps) => {
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
        {!isFullscreen ? (
          <>
            <path
              strokeWidth={strokeWidth}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              d="M2.8,17L17.1,2.7"
            />
            <path
              strokeWidth={strokeWidth}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              d="M17,7.3l0.1-4.5l-4.5,0.1"
            />
            <path
              strokeWidth={strokeWidth}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              d="M2.9,12.5L2.8,17l4.5-0.1"
            />
          </>
        ) : (
          <>
            <path
              strokeWidth={strokeWidth}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              d="M8.2,11.8l-5.6,5.6"
            />
            <path
              strokeWidth={strokeWidth}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              d="M8.1,16.3l0.1-4.5l-4.5,0.1"
            />
            <path
              strokeWidth={strokeWidth}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              d="M11.8,8.2l5.6-5.6"
            />
            <path
              strokeWidth={strokeWidth}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              d="M11.9,3.7l-0.1,4.5l4.5-0.1"
            />
          </>
        )}
      </svg>
    </div>
  );
};
