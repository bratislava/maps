import React from "react";
import cx from "classnames";

export interface IMobileTopSlotProps {
  leftText: string;
  rightText: string;
  onLeftClick: () => void;
  onRightClick: () => void;
  selectedIndex?: number;
}

const MobileTopSlot = ({
  leftText,
  rightText,
  onLeftClick,
  onRightClick,
  selectedIndex,
}: IMobileTopSlotProps) => {
  return (
    <div className="mt-4 mx-4 text-secondary font-medium bg-white items-center flex rounded-lg shadow-lg overflow-hidden">
      <button
        className={cx("flex-1 py-3 font-bold", {
          "bg-primary text-white": selectedIndex === 0,
          "bg-white text-primary": selectedIndex !== 0,
        })}
        onClick={onLeftClick}
      >
        {leftText}
      </button>
      <button
        className={cx("flex-1 p-3 font-bold", {
          "bg-secondary text-white": selectedIndex === 1,
          "bg-white text-secondary": selectedIndex !== 1,
        })}
        onClick={onRightClick}
      >
        {rightText}
      </button>
    </div>
  );
};

export default MobileTopSlot;
