import React from "react";
import cx from "classnames";

interface IDropdownArrowProps {
  isBottom?: boolean;
  isCenter?: boolean;
}

export const DropdownArrow = ({
  isBottom = false,
  isCenter = true,
}: IDropdownArrowProps) => {
  return (
    <div
      className={cx("w-full absolute z-10", {
        "-top-2": !isBottom,
        "-bottom-2 transform rotate-180": isBottom,
        "justify-center": isCenter,
      })}
    >
      <div
        className={cx("flex relative", {
          "justify-center": isCenter,
        })}
      >
        <svg
          className="absolute w-24 max-w-full -z-10"
          width={100}
          height={10}
          x="0px"
          y="0px"
          viewBox="0 0 60 6"
          style={{
            filter: "drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.16))",
          }}
        >
          <path fill="white" d="M60,6L30,0L0,6h1.1H60z" />
        </svg>
        <svg
          className="absolute w-24 max-w-full -z-20"
          width={100}
          height={10}
          x="0px"
          y="0px"
          viewBox="0 0 60 6"
        >
          <path fill="white" d="M60,6L30,0L0,6h1.1H60z" />
        </svg>
      </div>
    </div>
  );
};
