import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";

export interface ISatelliteProps extends IIconComponentProps {
  className?: string;
}

export const Satellite = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: ISatelliteProps) => {
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
          d="M10,18c4.4,0,8-3.6,8-8s-3.6-8-8-8s-8,3.6-8,8S5.6,18,10,18z"
        />
      </svg>
    </div>
  );
};
