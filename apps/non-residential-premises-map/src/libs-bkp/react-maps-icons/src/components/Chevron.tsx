import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";

export interface IChevronProps extends IIconComponentProps {
  className?: string;
}

export const Chevron = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: IChevronProps) => {
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
        <polyline
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          points="18,13.6 10,5.6 2,13.6 "
        />
      </svg>
    </div>
  );
};
