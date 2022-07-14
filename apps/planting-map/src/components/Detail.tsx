import { useTranslation } from "react-i18next";
import { Feature } from "geojson";
import { useArcgeoAttachments } from "@bratislava/react-esri";
import { useState, useEffect } from "react";
import { X } from "@bratislava/react-maps-icons";

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
}

export const Detail = ({ features, onClose }: DetailProps) => {
  const { t, i18n } = useTranslation();

  const [feature, setFeature] = useState<Feature | null>(null);

  useEffect(() => {
    setFeature(null);

    const firstFeature = features[0];
    if (firstFeature) {
      setFeature(firstFeature);
    }
  }, [features]);

  return !feature ? null : (
    <>
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
          {/* <Row label={t(`layers.esri.detail.district`)} text={feature?.properties?.district} /> */}
          {/* <Row
            label={t(`layers.esri.detail.cadastralArea`)}
            text={feature?.properties?.cadastralArea}
          /> */}
        </div>
      </div>
      {/* <pre className="p-2 h-72 bg-black text-white overflow-auto">
        <code>{JSON.stringify(feature?.properties, null, 2)}</code>
      </pre> */}
    </>
  );
};

export default Detail;
