import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";

export interface IInformationAltProps extends IIconComponentProps {
  className?: string;
}

export const InformationAlt = ({
  size: inputSize = "default",
  direction = "top",
  className,
}: IInformationAltProps) => {
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
          fill="currentColor"
          strokeLinecap="round"
          d="M10,3.3c0.4,0,0.6-0.3,0.6-0.6C10.7,2.3,10.4,2,10,2C9.7,2,9.4,2.3,9.4,2.6C9.4,3,9.7,3.3,10,3.3z"
        />
        <path
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          d="M7.9,6.8h2.6v10.9"
        />
        <path
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          d="M13.5,17.8H7.4"
        />
      </svg>
    </div>
  );
};
