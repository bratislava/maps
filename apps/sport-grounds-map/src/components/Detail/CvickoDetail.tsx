import React from "react";
import { Feature, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { Chevron, X } from "@bratislava/react-maps-icons";
import { Row } from "./Row";
import { Tag } from "@bratislava/react-maps-ui";
import { Image } from "./Image";

export interface CvickoDetailProps {
  feature: Feature<Point>;
  onClose: () => void;
  isExpanded: boolean;
}

export const CvickoDetail = ({ feature, onClose, isExpanded }: CvickoDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.cvicko.detail" });
  const { t: mainT } = useTranslation();

  if (!feature) return null;

  const imgSrc = feature.properties?.photo ?? null;

  return (
    <div className="relative flex flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode w-full">
      {isExpanded ? (
        <>
          <button
            className="hidden z-20 sm:block absolute right-4 top-6 p-2 bg-white dark:bg-gray-darkmode dark:bg-opacity-20 rounded-full"
            onClick={onClose}
          >
            <X size="xs" />
          </button>

          <Image src={imgSrc} />

          <div className="absolute top-[232px] left-6">
            <a
              href={feature.properties?.["navigate"]}
              target="_blank"
              rel="noreferrer"
              className="group font-semibold select-none cursor-pointer flex items-center gap-4 bg-primary text-white w-fit px-6 h-12 rounded-lg"
            >
              <span>{t("wantToGym")}</span>
              <div className="relative flex items-center">
                <div className="absolute transition-all right-1 w-0 group-hover:w-5 group-hover:-right-1 h-[2px] rounded-full bg-white"></div>
                <Chevron
                  className="group-hover:translate-x-2 transition-transform"
                  direction="right"
                  size="sm"
                />
              </div>
            </a>
          </div>

          <div className="flex p-6 pt-12 pb-26 md:pb-8 md:pt-12 flex-col space-y-6">
            <a
              className="text-primary dark:text-primary-soft underline font-semibold"
              href={feature.properties?.["navigate"]}
              target="_blank"
              rel="noreferrer"
            >
              {t("navigate")}
            </a>

            <Row label={t("name")} text={feature.properties?.["name"]} />

            <div>
              <div className="mb-1 font-light">{t(`tags`)}</div>
              <div className="flex flex-wrap gap-2">
                {feature.properties?.["tags"]?.map((tag: unknown) => (
                  <Tag
                    className="font-semibold bg-primary-soft dark:text-background-darkmode"
                    key={`${tag}`}
                  >
                    {mainT(`filters.tag.tags.${tag}`)}
                  </Tag>
                ))}
              </div>
            </div>
            <Row label={t("location")} text={feature.properties?.["location"]} />
            <Row label={t("email")} text={feature.properties?.["email"]} />
            <Row label={t("website")} text={feature.properties?.["website"]} />
          </div>
        </>
      ) : (
        <div className="mx-6 font-semibold mt-3">{feature.properties?.["name"]}</div>
      )}
    </div>
  );
};

export default CvickoDetail;
