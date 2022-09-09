import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";

export interface IMagnifyingGlassProps extends IIconComponentProps {
  className?: string;
}

export const MagnifyingGlass = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: IMagnifyingGlassProps) => {
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
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          cx={9}
          cy={9}
          r={6}
        />
        <path
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          d="M13.1,13.1l4.2,4.2"
        />
      </svg>
    </div>
  );
};
