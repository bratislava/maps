import { useIconParams } from "../hooks/useIconParams";
import { IIconComponentProps } from "../types";
import { motion } from "framer-motion";

export interface IEyeProps extends IIconComponentProps {
  className?: string;
  isCrossed?: boolean;
}

export const Eye = ({
  size: inputSize = "default",
  direction = "top",
  className,
  isCrossed = false,
}: IEyeProps) => {
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
          d="M 1.59 10.054 C 1.74 10.26 5.332 15.103 9.919 15.103 C 14.509 15.103 18.1 10.26 18.251 10.054 C 18.394 9.857 18.394 9.592 18.251 9.396 C 18.1 9.192 14.509 4.346 9.919 4.346 C 5.332 4.346 1.74 9.192 1.59 9.396 C 1.447 9.592 1.447 9.857 1.59 10.054 Z"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
        />
        <path
          d="M 9.826 12.972 C 11.617 12.972 13.072 11.515 13.072 9.725 C 13.072 7.934 11.617 6.477 9.826 6.477 C 8.036 6.477 6.578 7.934 6.578 9.725 C 6.578 11.515 8.036 12.972 9.826 12.972 Z"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
        />
        <motion.path
          animate={{
            pathLength: isCrossed ? 1 : 0,
            opacity: isCrossed ? 1 : 0,
          }}
          d="M 2.537 14.198 L 17.546 5.454"
          strokeWidth={strokeWidth}
          stroke="currentColor"
        />
      </svg>
    </div>
  );
};
