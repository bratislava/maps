import { Placement } from "@floating-ui/react-dom-interactions";
import cx from "classnames";
import { forwardRef } from "react";
interface IPopoverArrowProps {
  placement: Placement;
  x: number;
  y: number;
  isSmall?: boolean;
}

export const PopoverArrow = forwardRef<HTMLDivElement, IPopoverArrowProps>(
  ({ placement, x, y, isSmall = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cx("absolute z-10 w-20", {
          "scale-x-[0.3]": isSmall,
          "-rotate-90 -translate-x-[50px]": placement === "right",
        })}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        <div className={cx("flex relative", {})}>
          <svg
            className="absolute w-20 max-w-full -z-10"
            width={100}
            height={10}
            x="0px"
            y="0px"
            viewBox="0 -1 60 6"
            style={{
              filter: "drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.16))",
            }}
          >
            <path
              // className="fill-primary"
              className="fill-background-lightmode dark:fill-background-darkmode"
              d="M60,6L30,0L0,6h1.1H60z"
            />
          </svg>
          <svg
            className="absolute w-20 max-w-full -z-20"
            width={100}
            height={10}
            x="0px"
            y="0px"
            viewBox="0 -1 60 7"
          >
            <path
              className="fill-background-lightmode dark:fill-background-darkmode"
              d="M60,6L30,0L0,6h1.1H60z"
            />
            <path
              strokeWidth={2}
              className="
              fill-background-lightmode 
              stroke-background-lightmode 
              dark:fill-background-darkmode 
              dark:stroke-gray-darkmode/20
            "
              d="M60,6L30,0L0,6h1.1"
            />
          </svg>
        </div>
      </div>
    );
  }
);

PopoverArrow.displayName = "PopoverArrow";
