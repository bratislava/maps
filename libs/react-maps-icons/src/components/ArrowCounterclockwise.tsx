import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";

export interface IArrowCounterclockwiseProps extends IIconComponentProps {
  className?: string;
}

export const ArrowCounterclockwise = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: IArrowCounterclockwiseProps) => {
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
          stroke="currentColor"
          strokeLinecap="round"
          d="M17.2,9.7v0.7v0c0,4.2-3.4,7.6-7.6,7.6C5.4,18,2,14.6,2,10.4c0-4.2,3.4-7.6,7.6-7.6c1.1,0,2.1,0.2,3.1,0.7"
        />
        <path
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          d="M19,11.6l-1.8-2.6l-1.9,2.6"
        />
      </svg>
    </div>
  );
};
