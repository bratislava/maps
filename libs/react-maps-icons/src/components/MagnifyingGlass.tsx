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
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          strokeWidth={strokeWidth}
          d="M10.9711 1.60986C15.9711 1.60986 20.0311 5.67986 20.0311 10.6799C20.0311 13.0999 19.0711 15.2999 17.5211 16.9199L21.6211 21.0199L20.5611 22.0799L16.4011 17.9199C14.8811 19.0599 13.0011 19.7499 10.9611 19.7499C5.96109 19.7499 1.89109 15.6799 1.89109 10.6799C1.89109 5.67986 5.97109 1.60986 10.9711 1.60986ZM10.9711 18.2499C15.1411 18.2499 18.5411 14.8499 18.5411 10.6799C18.5411 6.50986 15.1411 3.10986 10.9711 3.10986C6.80109 3.10986 3.40109 6.50986 3.40109 10.6799C3.40109 14.8499 6.80109 18.2499 10.9711 18.2499Z"
          fill="#333333" />
      </svg>
    </div>
  );
};
