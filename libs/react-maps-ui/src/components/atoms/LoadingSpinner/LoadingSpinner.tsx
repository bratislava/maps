import React from "react";

import { SpinnerCircular } from "spinners-react";

interface ILoadingSpinnerProps {
  color: string;
  size?: number;
  secondaryColor?: string;
  thickness?: number;
  speed?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 32,
  color,
  secondaryColor = "rgba(172, 57, 57, 0)",
  thickness = 100,
  speed = 100,
  className,
}: ILoadingSpinnerProps) => {
  return (
    <SpinnerCircular
      className={className}
      size={size}
      thickness={thickness}
      speed={speed}
      color={color}
      secondaryColor={secondaryColor}
    />
  );
};
