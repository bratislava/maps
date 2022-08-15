import cx from "classnames";
import { useMemo } from "react";

import { ReactComponent as AssistantIcon } from "../assets/icons/assistant.svg";
import { ReactComponent as BranchIcon } from "../assets/icons/branch.svg";
import { ReactComponent as GarageIcon } from "../assets/icons/garage.svg";
import { ReactComponent as ParkingLotIcon } from "../assets/icons/p-plus-r.svg";
import { ReactComponent as ParkomatIcon } from "../assets/icons/parkomat.svg";
import { ReactComponent as PartnerIcon } from "../assets/icons/partner.svg";
import { ReactComponent as ResidentIcon } from "../assets/icons/resident.svg";
import { ReactComponent as VisitorIcon } from "../assets/icons/visitor.svg";

const icons = [
  {
    name: "assistant",
    component: AssistantIcon,
  },
  {
    name: "branch",
    component: BranchIcon,
  },
  {
    name: "parkomat",
    component: ParkomatIcon,
  },
  {
    name: "parking-lot",
    component: ParkingLotIcon,
  },
  {
    name: "resident",
    component: ResidentIcon,
  },
  {
    name: "visitor",
    component: VisitorIcon,
  },
  {
    name: "partner",
    component: PartnerIcon,
  },
  {
    name: "garage",
    component: GarageIcon,
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
  const isPrimary = useMemo(() => {
    return ["assistant", "parkomat", "parking-lot", "garage", "partner", "visitor"].includes(icon);
  }, [icon]);

  const IconSvgComponent = icons.find((i) => i.name === icon)?.component;

  return IconSvgComponent ? (
    <div
      className={cx(
        "relative transform active:scale-75 transition-transform cursor-pointer w-fit h-fit rounded-full text-white flex items-center justify-center",
        {
          "bg-white text-primary z-50": isPrimary && isWhite,
          "bg-primary text-secondary": isPrimary && !isWhite,
          "bg-white text-secondary z-50": !isPrimary && isWhite,
          "bg-secondary text-primary": !isPrimary && !isWhite,
          "shadow-lg": shadow,
        },
      )}
    >
      {count !== undefined && (
        <div
          className={cx(
            "absolute -top-[6px] -right-[8px] rounded-full min-w-[24px] px-2 h-6 text font-bold flex items-center shadow-lg",
            {
              "text-white bg-secondary": isPrimary,
              "text-secondary bg-white": !isPrimary,
            },
          )}
        >
          {count}
        </div>
      )}
      <IconSvgComponent width={size} height={size} />
    </div>
  ) : null;
};
