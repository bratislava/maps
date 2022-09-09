import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";

export interface IInformationProps extends IIconComponentProps {
  className?: string;
}

export const Information = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: IInformationProps) => {
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
        <circle
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          cx="9"
          cy="9.5"
          r="7.6"
        />
        <line
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          x1="9"
          y1="9"
          x2="9"
          y2="12"
        />
        <circle fill="currentColor" cx="9" cy="5.7" r="0.8" />
      </svg>
    </div>
  );
};
