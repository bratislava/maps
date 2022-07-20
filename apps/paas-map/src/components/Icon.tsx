import React, { useMemo } from "react";
import cx from "classnames";

import { ReactComponent as AssistantIcon } from "../assets/icons/assistant.svg";
import { ReactComponent as BranchIcon } from "../assets/icons/branch.svg";
import { ReactComponent as ParkomatIcon } from "../assets/icons/parkomat.svg";
import { ReactComponent as GarageIcon } from "../assets/icons/garage.svg";
import { ReactComponent as PartnerIcon } from "../assets/icons/partner.svg";
import { ReactComponent as ResidentIcon } from "../assets/icons/resident.svg";
import { ReactComponent as VisitorIcon } from "../assets/icons/visitor.svg";
import { ReactComponent as PPlusRIcon } from "../assets/icons/p-plus-r.svg";
import { ReactComponent as PPlusRRegionIcon } from "../assets/icons/p-plus-r-region.svg";

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
    name: "p-plus-r",
    component: PPlusRIcon,
  },
  {
    name: "p-plus-r-region",
    component: PPlusRRegionIcon,
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
    name: "garage-visitor",
    component: GarageIcon,
  },
  {
    name: "garage-resident",
    component: GarageIcon,
  },
] as const;

export interface IIconProps {
  icon: typeof icons[number]["name"];
  size?: number;
  isWhite?: boolean;
  count?: number;
}

export const Icon = ({ icon, size = 24, isWhite = false, count }: IIconProps) => {
  const isPrimary = useMemo(() => {
    return [
      "assistant",
      "parkomat",
      "p-plus-r",
      "p-plus-r-region",
      "garage-visitor",
      "partner",
      "visitor",
    ].includes(icon);
  }, [icon]);

  const IconSvgComponent = icons.find((i) => i.name === icon)?.component;

  return IconSvgComponent ? (
    <div
      className={cx(
        "relative transform active:scale-75 transition-transform cursor-pointer w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg",
        {
          "bg-white text-primary z-50": isPrimary && isWhite,
          "bg-primary text-primary-soft": isPrimary && !isWhite,
          "bg-white text-primary-soft z-50": !isPrimary && isWhite,
          "bg-primary-soft text-primary": !isPrimary && !isWhite,
        },
      )}
    >
      {count !== undefined && (
        <div
          className={cx(
            "absolute -top-[6px] -right-[8px] rounded-full min-w-[24px] px-2 h-6 text font-bold flex items-center shadow-lg",
            {
              "text-white bg-primary-soft": isPrimary,
              "text-primary-soft bg-white": !isPrimary,
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
