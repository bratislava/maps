import React from "react";
import { Feature } from "geojson";
import { useTranslation } from "react-i18next";
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

export interface DetailProps {
  features: Feature[];
  onClose: () => void;
}

export const Row = ({ label, text }: { label: string; text: string }) => {
  if (!text || (text === " " && !label)) {
    return null;
  } else {
    return (
      <div className="">
        <div>{label}</div>
        <div className="font-bold">{text}</div>
      </div>
    );
  }
};

export const Detail = ({ features }: DetailProps) => {
  const { t } = useTranslation();

  if (!(features && features[0])) return null;

  const feature = features[0];

  const Icon = icons.find((icon) => feature.properties?.icon === icon.name)?.component;

  return (
    <div className="p-8 pb-26 flex flex-col justify-end space-y-4 bg-background sm:bg-primary-soft md:pb-8 md:pt-5 w-full">
      <div className="flex flex-col space-y-4">
        {Icon && <Icon width={48} height={48} />}
        <div className="font-bold font-md pb-4 text-[20px]">
          {t(`layers.sportGrounds.detail.title`)}
        </div>
        <Row label={t(`layers.sportGrounds.detail.name`)} text={feature.properties?.["name"]} />
        <Row label={t(`layers.sportGrounds.detail.kind`)} text={feature.properties?.["kind"]} />
        <Row label={t(`layers.sportGrounds.detail.type`)} text={feature.properties?.["type"]} />
        <Row
          label={t(`layers.sportGrounds.detail.address`)}
          text={feature.properties?.["address"]}
        />
        <Row
          label={t(`layers.sportGrounds.detail.contact`)}
          text={feature.properties?.["contact"]}
        />
        <Row
          label={t(`layers.sportGrounds.detail.operator`)}
          text={feature.properties?.["operator"]}
        />
        <Row label={t(`layers.sportGrounds.detail.phone`)} text={feature.properties?.["phone"]} />
        <Row label={t(`layers.sportGrounds.detail.email`)} text={feature.properties?.["email"]} />
        <Row
          label={t(`layers.sportGrounds.detail.website`)}
          text={feature.properties?.["website"]}
        />
        <Row
          label={t(`layers.sportGrounds.detail.openingHours`)}
          text={feature.properties?.["openingHours"]}
        />
        <Row
          label={t(`layers.sportGrounds.detail.entrace`)}
          text={feature.properties?.["entrace"]}
        />
        <Row label={t(`layers.sportGrounds.detail.note`)} text={feature.properties?.["note"]} />
      </div>
    </div>
  );
};

export default Detail;
