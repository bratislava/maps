import React, { useEffect, useMemo, useState } from "react";
import { Feature, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { Chevron, X } from "@bratislava/react-maps-icons";
import { Row } from "./Row";
import { Tag } from "@bratislava/react-maps-ui";
import { Image } from "./Image";
import { BottomSheet } from "react-spring-bottom-sheet";
import cx from "classnames";

export interface DetailProps {
  feature: Feature<Point> | null;
  onClose: () => void;
  isMobile: boolean;
  currentCvickoId: string | null;
}

export const Detail = ({
  feature: inputFeature,
  onClose,
  isMobile,
  currentCvickoId,
}: DetailProps) => {
  const { t } = useTranslation();

  const [feature, setFeature] = useState<Feature | null>(inputFeature);

  useEffect(() => {
    if (inputFeature) {
      setFeature(inputFeature);
    }
  }, [inputFeature]);

  const imgSrc = useMemo(() => feature?.properties?.photo ?? null, [feature]);

  const detail = (
    <div className="relative flex flex-col justify-end text-black dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode w-full">
      <button
        className="z-20 block absolute right-4 top-6 p-2 bg-background-lightmode dark:bg-background-darkmode text-foreground-lightmode dark:text-foreground-darkmode rounded-full"
        onClick={onClose}
      >
        <X size="sm" />
      </button>

      <Image src={imgSrc} />

      {currentCvickoId !== feature?.properties?.id && (
        <div className="absolute top-[136px] sm:top-[232px] left-6">
          <a
            href={feature?.properties?.["wantToWorkout"]}
            target="_blank"
            rel="noreferrer"
            className="group font-semibold select-none cursor-pointer flex items-center gap-4 bg-blue text-white w-fit px-6 h-12 rounded-lg"
          >
            <span>{t("detail.wantToWorkout")}</span>
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
      )}

      <div
        className={cx(
          "flex p-6 pb-26 md:pb-8 flex-col space-y-6",
          currentCvickoId !== feature?.properties?.id ? "pt-12" : "pt-6",
        )}
      >
        <a
          className="text-blue dark:text-white underline font-semibold"
          href={feature?.properties?.["navigationLink"]}
          target="_blank"
          rel="noreferrer"
        >
          {t("detail.navigate")}
        </a>

        <Row label={t("detail.name")} text={`Cvičko ${feature?.properties?.["name"]}`} />

        <div>
          <div className="mb-1 font-light">{t(`detail.tags`)}</div>
          <div className="flex flex-wrap gap-2">
            {feature?.properties?.["tags"]?.map((tag: string) => (
              <Tag className="font-semibold text-black bg-blue-soft  " key={`${tag}`}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
        <Row label={t("detail.sportGround")} text={feature?.properties?.["category"]} />
        <Row label={t("detail.location")} text={feature?.properties?.["location"]} />
        <Row label={t("detail.email")} text={"info@bratislava.sk"} />
      </div>
    </div>
  );

  return isMobile ? (
    <BottomSheet
      snapPoints={({ maxHeight }) => [(maxHeight / 5) * 3]}
      blocking={false}
      className="relative z-30"
      open={!!inputFeature}
      draggable={false}
    >
      {detail}
    </BottomSheet>
  ) : (
    <div
      className={cx(
        "fixed top-0 right-0 w-96 overflow-auto max-h-full bg-background transition-all duration-500",
        {
          "translate-x-full": !inputFeature,
          "shadow-lg": !!inputFeature,
        },
      )}
    >
      {detail}
    </div>
  );
};

export default Detail;
