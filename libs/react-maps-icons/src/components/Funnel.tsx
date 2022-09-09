import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";

export interface IFunnelProps extends IIconComponentProps {
  className?: string;
}

export const Funnel = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: IFunnelProps) => {
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
          d="M17.6,3.8H2.4l6.1,7.2v5l3,1.5v-6.5L17.6,3.8z"
        />
      </svg>
    </div>
  );
};
