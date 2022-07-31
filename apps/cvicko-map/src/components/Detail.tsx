import { useTranslation } from "react-i18next";
import { Feature } from "geojson";
import { useState, useEffect, useRef } from "react";
import { X } from "@bratislava/react-maps-icons";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import cx from "classnames";

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
    <div className="flex flex-col space-y-4 p-8 pt-0 sm:pt-4 overflow-auto">
      <button className="hidden sm:block absolute right-4 top-8 p-2" onClick={onClose}>
        <X />
      </button>
      <div className="flex flex-col space-y-4">
        <div className="first-letter:uppercase font-bold font-md text-[20px]">
          {feature?.properties?.["TYP_VYKONU_1"] ?? t(`layers.esri.detail.title`)}
        </div>
        <Row label={t(`layers.esri.detail.nameSk`)} text={feature?.properties?.nameSk} />
        <Row label={t(`layers.esri.detail.nameLat`)} text={feature?.properties?.nameLat} />
        <Row label={t(`layers.esri.detail.cultivar`)} text={feature?.properties?.cultivar} />
        <Row label={t(`layers.esri.detail.log`)} text={feature?.properties?.log} />
        <Row label={t(`layers.esri.detail.height`)} text={feature?.properties?.height} />
        <Row label={t(`layers.esri.detail.year`)} text={feature?.properties?.year} />
        <Row label={t(`layers.esri.detail.donor`)} text={feature?.properties?.donor} />
      </div>
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
        "fixed top-0 right-0 w-96 bg-background-lightmode dark:bg-background-darkmode transition-all duration-500",
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
