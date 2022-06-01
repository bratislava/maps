interface ILoadingSpinnerProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 32,
  color = "black",
  strokeWidth = 8,
  className,
}: ILoadingSpinnerProps) => {
  const PI = 3.14;
  const circumference = PI * size;
  return (
    <svg
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
    >
      <style>
        {`
        @keyframes a {
          from {
            stroke-dasharray:${circumference} 0
          }
          50% {
            stroke-dasharray: 0 ${circumference}
          }
          to {
            stroke-dasharray:${circumference} 0
          }
        }
        @keyframes o {
          from {
            stroke-dashoffset:${(circumference * 0.75).toFixed(0)} 
          }
          to {
            stroke-dashoffset:${(circumference * 3.75).toFixed(0)} 
          }
        }
    `}
      </style>
      <circle
        style={{
          animation: "4s a infinite linear, 3s o infinite linear",
          animationDirection: "reverse",
        }}
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - strokeWidth / 2}
        strokeWidth={strokeWidth}
        fill="none"
        stroke={color}
      />
    </svg>
  );
};
