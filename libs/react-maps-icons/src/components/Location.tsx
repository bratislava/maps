import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";

export interface ILocationProps extends IIconComponentProps {
  className?: string;
  isActive?: boolean;
}

export const Location = ({
  size: inputSize = "default",
  direction = "top",
  className,
  isActive,
}: ILocationProps) => {
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
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          d="M10,16.8c3.6,0,6.6-2.9,6.6-6.6S13.6,3.6,10,3.6s-6.6,2.9-6.6,6.6S6.4,16.8,10,16.8z"
        />
        <path
          strokeWidth={strokeWidth}
          fill={isActive ? "currentColor" : "none"}
          stroke="currentColor"
          strokeLinecap="round"
          d="M10,12.3c1.1,0,2.1-0.9,2.1-2.1S11.1,8.1,10,8.1c-1.1,0-2.1,0.9-2.1,2.1S8.9,12.3,10,12.3z"
        />
        <path
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          d="M10,1.4v2.2"
        />
        <path
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          d="M10,16.8V19"
        />
        <path
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          d="M1.2,10.2h2.2"
        />
        <path
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          d="M16.6,10.2h2.2"
        />
      </svg>
    </div>
  );
};
