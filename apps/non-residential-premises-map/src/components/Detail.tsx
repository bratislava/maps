import { useTranslation } from "react-i18next";
import { Feature } from "geojson";
import { useState, useEffect, useRef } from "react";
import { X } from "@bratislava/react-maps-icons";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import cx from "classnames";
import { DataDisplay, JsonViewer, Tag } from "@bratislava/react-maps-ui";
import colors from "../utils/colors.json";

export interface DetailProps {
  features: Feature[];
  onClose: () => void;
  isMobile: boolean;
}

export const Detail = ({ features, onClose, isMobile }: DetailProps) => {
  const { t } = useTranslation();

  const sheetRef = useRef<BottomSheetRef>(null);

  const [feature, setFeature] = useState<Feature | null>(null);

  useEffect(() => {
    setFeature(null);

    const firstFeature = features[0];
    if (firstFeature) {
      setFeature(firstFeature);
    }
  }, [features]);

  useEffect(() => {
    if (feature) {
      sheetRef.current?.snapTo(({ snapPoints }) => snapPoints[1]);
    }
  }, [feature, sheetRef]);

  const detail = (
    <div className="flex flex-col max-h-screen space-y-4 p-8 pt-0 sm:pt-4 overflow-auto">
      <button className="hidden sm:block absolute right-4 top-8 p-2" onClick={onClose}>
        <X />
      </button>
      <div className="flex flex-col space-y-4">
        <div className="font-semibold">{t("detail.title")}</div>
        <Tag
          className="w-fit text-white"
          style={{
            background: feature?.properties?.occupancy === "free" ? colors.free : colors.occupied,
          }}
        >
          {feature?.properties?.occupancy === "free" ? t("detail.free") : t("detail.occupied")}
        </Tag>

        <DataDisplay label={t(`detail.locality`)} text={feature?.properties?.locality} />
        <DataDisplay label={t(`detail.purpose`)} text={feature?.properties?.purpose} />
        <DataDisplay label={t(`detail.lessee`)} text={feature?.properties?.lessee} />
        <DataDisplay label={t(`detail.rentUntil`)} text={feature?.properties?.rentUntil} />
        <DataDisplay label={t(`detail.description`)} text={feature?.properties?.description} />
        <DataDisplay
          label={t(`detail.approximateArea`)}
          text={
            typeof feature?.properties?.approximateArea === "number" && (
              <span>
                {feature?.properties?.approximateArea.toFixed(2).replace(".", ",")} m
                <sup className="text-xs font-bold">2</sup>
              </span>
            )
          }
        />
        <DataDisplay
          label={t(`detail.approximateRentPricePerYear`)}
          text={
            typeof feature?.properties?.approximateRentPricePerYear === "number" && (
              <span>
                {(Math.round(feature?.properties?.approximateRentPricePerYear / 10) * 10)
                  .toFixed(2)
                  .replace(".", ",")}{" "}
                €
              </span>
            )
          }
        />
      </div>

      {feature && import.meta.env.DEV && <JsonViewer json={feature.properties} />}
    </div>
  );

  return isMobile ? (
    <BottomSheet
      ref={sheetRef}
      snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 2, 80]}
      defaultSnap={({ snapPoints }) => snapPoints[1]}
      expandOnContentDrag
      blocking={false}
      className="relative z-30"
      open={!!feature}
    >
      {detail}
    </BottomSheet>
  ) : !feature ? null : (
    <div
      className={cx(
        "fixed top-0 right-0 w-96 rounded-bl-lg bg-background-lightmode dark:bg-background-darkmode transition-all duration-500",
        {
          "translate-x-full": !feature,
          "shadow-lg": feature,
        },
      )}
    >
      {detail}
    </div>
  );
};

export default Detail;
