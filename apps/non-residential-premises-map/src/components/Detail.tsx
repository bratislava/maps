import { useTranslation } from "react-i18next";
import { Feature } from "geojson";
import { useState, useEffect, useRef } from "react";
import { X } from "@bratislava/react-maps-icons";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import cx from "classnames";
import { DataDisplay, JsonViewer } from "@bratislava/react-maps-ui";

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
        <DataDisplay label={t(`layers.esri.detail.purpose`)} text={feature?.properties?.purpose} />
        <DataDisplay label={t(`layers.esri.detail.lessee`)} text={feature?.properties?.lessee} />
        <DataDisplay
          label={t(`layers.esri.detail.occupancy`)}
          text={feature?.properties?.occupancy}
        />
        <DataDisplay
          label={t(`layers.esri.detail.rentUntil`)}
          text={feature?.properties?.rentUntil}
        />
        <DataDisplay
          label={t(`layers.esri.detail.description`)}
          text={feature?.properties?.description}
        />
        <DataDisplay
          label={t(`layers.esri.detail.approximateArea`)}
          text={feature?.properties?.approximateArea}
        />
        <DataDisplay
          label={t(`layers.esri.detail.approximateRentPricePerYear`)}
          text={feature?.properties?.approximateRentPricePerYear}
        />
      </div>

      {feature && <JsonViewer json={feature.properties} />}
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
