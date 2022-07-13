import React from "react";
import { Feature, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { Icon } from "./Icon";
import { X } from "@bratislava/react-maps-icons";

export interface DetailProps {
  feature: Feature<Point> | null;
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

export const Detail = ({ feature, onClose }: DetailProps) => {
  const { t } = useTranslation();

  if (!feature) return null;

  return (
    <div className="p-8 pb-26 flex flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode sm:dark:text-foreground-lightmode space-y-4 bg-background sm:bg-primary-soft sm:text-foreground-lightmode md:pb-8 md:pt-5 w-full">
      <button className="hidden sm:block absolute right-4 top-8 p-2" onClick={onClose}>
        <X />
      </button>
      <div className="flex flex-col space-y-4">
        <Icon size={48} icon={feature.properties?.icon} />
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
