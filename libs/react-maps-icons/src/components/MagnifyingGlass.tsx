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
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeWidth={strokeWidth}
          stroke="currentColor"
          d="M9.971.61c5 0 9.06 4.07 9.06 9.07 0 2.42-.96 4.62-2.51 6.24l4.1 4.1-1.06 1.06-4.16-4.16a9.042 9.042 0 0 1-5.44 1.83c-5 0-9.07-4.07-9.07-9.07S4.971.61 9.971.61Zm0 16.64c4.17 0 7.57-3.4 7.57-7.57s-3.4-7.57-7.57-7.57-7.57 3.4-7.57 7.57 3.4 7.57 7.57 7.57Z"
          fill="#333"
        />
      </svg>
    </div>
  );
};
