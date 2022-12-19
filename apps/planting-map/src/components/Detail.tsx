import { useTranslation } from "react-i18next";
import { Feature } from "geojson";
import { useState, useEffect, useRef } from "react";
import { X } from "@bratislava/react-maps-icons";
import { Detail as MapDetail } from "@bratislava/react-maps";
import { SheetHandle } from "@bratislava/react-maps-ui";

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

  const detailRef = useRef<SheetHandle>(null);

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
      detailRef.current?.snapTo(1);
    }
  }, [feature, detailRef]);

  const detail = (
    <div className="flex flex-col space-y-4 p-8 pt-6">
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
  );

  return (
    <MapDetail
      ref={detailRef}
      isBottomSheet={isMobile}
      onClose={onClose}
      isVisible={!!feature}
      bottomSheetSnapPoints={[84, "50%", "100%"]}
      bottomSheetInitialSnap={1}
      // onBottomSheetSnapChange={onSnapChange}
    >
      {detail}
    </MapDetail>
  );
};

export default Detail;
