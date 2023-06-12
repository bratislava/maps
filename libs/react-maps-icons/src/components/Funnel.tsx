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
        width={22}
        height={20}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeWidth={strokeWidth}
          d="M9.17 19.26c-.15 0-.3-.04-.44-.12a.887.887 0 0 1-.45-.78v-7L.73 2.03A.997.997 0 0 1 .6.96c.17-.35.52-.58.91-.58h19.22a1 1 0 0 1 .91.58c.17.35.12.77-.13 1.07l-7.55 9.33v5.17l-4.35 2.6a.94.94 0 0 1-.46.13h.02ZM2.54 1.89l7.24 8.95v6.46l2.7-1.61v-4.85l7.24-8.95H2.54Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
