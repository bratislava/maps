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

const icons = [
  {
    name: "basketball-icon",
    component: BasketballIcon,
  },
  {
    name: "cvicko-icon",
    component: CvickoIcon,
  },
  {
    name: "other-icon",
    component: OtherIcon,
  },
  {
    name: "fitness-icon",
    component: FitnessIcon,
  },
  {
    name: "football-icon",
    component: FootballIcon,
  },
  {
    name: "gym-icon",
    component: GymIcon,
  },
  {
    name: "hockey-icon",
    component: HockeyIcon,
  },
  {
    name: "pool-icon",
    component: PoolIcon,
  },
  {
    name: "running-track-icon",
    component: RunningTrackIcon,
  },
  {
    name: "table-tennis-icon",
    component: TableTennisIcon,
  },
  {
    name: "tennis-icon",
    component: TennisIcon,
  },
  {
    name: "water-icon",
    component: WaterIcon,
  },
];

export interface IIconProps {
  icon?: string;
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
