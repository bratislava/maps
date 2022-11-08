import React from "react";

import { ReactComponent as BasketballIcon } from "../assets/icons/basketball.svg";
import { ReactComponent as CvickoIcon } from "../assets/icons/cvicko.svg";
import { ReactComponent as OtherIcon } from "../assets/icons/other.svg";
import { ReactComponent as FitnessIcon } from "../assets/icons/fitness.svg";
import { ReactComponent as FootballIcon } from "../assets/icons/football.svg";
import { ReactComponent as GymIcon } from "../assets/icons/gym.svg";
import { ReactComponent as HockeyIcon } from "../assets/icons/hockey.svg";
import { ReactComponent as PoolIcon } from "../assets/icons/pool.svg";
import { ReactComponent as RunningTrackIcon } from "../assets/icons/running-track.svg";
import { ReactComponent as TableTennisIcon } from "../assets/icons/table-tennis.svg";
import { ReactComponent as TennisIcon } from "../assets/icons/tennis.svg";
import { ReactComponent as WaterIcon } from "../assets/icons/water.svg";

export const icons = [
  {
    name: "basketball",
    component: BasketballIcon,
  },
  {
    name: "cvicko",
    component: CvickoIcon,
  },
  {
    name: "fitness",
    component: FitnessIcon,
  },
  {
    name: "football",
    component: FootballIcon,
  },
  {
    name: "gym",
    component: GymIcon,
  },
  {
    name: "hockey",
    component: HockeyIcon,
  },
  {
    name: "pool",
    component: PoolIcon,
  },
  {
    name: "running-track",
    component: RunningTrackIcon,
  },
  {
    name: "table-tennis",
    component: TableTennisIcon,
  },
  {
    name: "tennis",
    component: TennisIcon,
  },
  {
    name: "water",
    component: WaterIcon,
  },
  {
    name: "other",
    component: OtherIcon,
  },
] as const;

export interface IIconProps {
  icon?: typeof icons[number]["name"];
  size?: number;
}

export const Icon = ({ icon, size = 24 }: IIconProps) => {
  const IconSvgComponent = icons.find((i) => i.name === icon)?.component;

  return IconSvgComponent ? (
    <IconSvgComponent width={size} height={size} />
  ) : (
    <OtherIcon width={size} height={size} />
  );
};
