import cx from "classnames";

import { ReactComponent as ClosureIcon } from "../assets/icons/closure.svg";
import { ReactComponent as DigupIcon } from "../assets/icons/digup.svg";
import { ReactComponent as DisorderIcon } from "../assets/icons/disorder.svg";
import { ReactComponent as RepairIcon } from "../assets/icons/repair.svg";

const icons = [
  {
    name: "closure",
    component: ClosureIcon,
  },
  {
    name: "digup",
    component: DigupIcon,
  },
  {
    name: "disorder",
    component: DisorderIcon,
  },
  {
    name: "repair",
    component: RepairIcon,
  },
] as const;

export interface IIconProps {
  icon: typeof icons[number]["name"];
  size?: number;
  isWhite?: boolean;
  count?: number;
  shadow?: boolean;
}

export const Icon = ({ icon, size = 24, isWhite = false, count, shadow = true }: IIconProps) => {
  const IconSvgComponent = icons.find((i) => i.name === icon)?.component;

  return IconSvgComponent ? (
    <div
      className={cx(
        "relative transform active:scale-75 transition-transform cursor-pointer w-fit h-fit rounded-full text-white flex items-center justify-center",
        {
          "bg-white !text-primary z-50": isWhite,
          "bg-primary text-secondary": !isWhite,
          "shadow-lg": shadow,
        },
      )}
    >
      {count !== undefined && (
        <div
          className={cx(
            "absolute -top-[6px] -right-[8px] rounded-full min-w-[24px] px-2 h-6 text font-bold flex items-center shadow-lg text-primary bg-primary-soft",
          )}
        >
          {count}
        </div>
      )}
      <IconSvgComponent width={size} height={size} />
    </div>
  ) : null;
};
