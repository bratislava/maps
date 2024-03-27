import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";

export interface IMinusProps extends IIconComponentProps {
  className?: string;
}

export const Minus = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: IMinusProps) => {
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
      </svg>
    </div>
  );
};
