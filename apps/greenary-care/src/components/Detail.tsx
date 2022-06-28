import { useTranslation } from "react-i18next";
import { Feature } from "geojson";
import { useArcgeoAttachments } from "@bratislava/mapbox-maps-esri";
import { useState, useEffect } from "react";
import { X } from "@bratislava/mapbox-maps-icons";

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
  arcgeoServerUrl: string;
  onClose: () => void;
}

export const Detail = ({ features, arcgeoServerUrl, onClose }: DetailProps) => {
  const { t, i18n } = useTranslation();

  const [feature, setFeature] = useState<Feature | null>(null);
  const [objectId, setObjectId] = useState<string | number | null>(null);

  useEffect(() => {
    setFeature(null);
    setObjectId(null);

    const firstFeature = features[0];
    if (firstFeature) {
      setFeature(firstFeature);
      if (firstFeature.properties?.["OBJECTID"]) setObjectId(firstFeature.properties?.["OBJECTID"]);
    }
  }, [features, setObjectId]);

  const { data: attachments } = useArcgeoAttachments(arcgeoServerUrl, objectId);

  return !features[0] ? null : (
    <>
      <div className="flex flex-col space-y-4 p-8 pt-4 overflow-auto">
        <button className="hidden sm:block absolute right-4 top-8 p-2" onClick={onClose}>
          <X />
        </button>
        <div className="flex flex-col space-y-4">
          <div className="first-letter:uppercase font-bold font-md text-[20px]">
            {feature?.properties?.["TYP_VYKONU_1"] ?? t(`layers.esri.detail.title`)}
          </div>
          <Row
            label={t(`layers.esri.detail.slovakName`)}
            text={feature?.properties?.["Drevina_SK"]}
          />
          <Row
            label={t(`layers.esri.detail.latinName`)}
            text={feature?.properties?.["Drevina_LAT"]}
          />
          <Row label={t(`layers.esri.detail.street`)} text={feature?.properties?.["ULICA"]} />
          <Row
            label={t(`layers.esri.detail.description`)}
            text={feature?.properties?.["POPIS_VYKONU_1"]}
          />
          {i18n.language}
          <Row
            label={t(`layers.esri.detail.date`)}
            text={new Date(feature?.properties?.["TERMIN_REAL_1"]).toLocaleString(i18n.language, {
              year: "numeric",
              day: "numeric",
              month: "numeric",
            })}
          />
          <Row label={t(`layers.esri.detail.district`)} text={feature?.properties?.["district"]} />

          {attachments && !!attachments.length && (
            <div>
              <div>{t(`layers.esri.detail.document`)}</div>
              <div>
                {attachments.map((attachment, index) => {
                  const attachmentUrl = `${arcgeoServerUrl}/${objectId}/attachment/${attachment.id}`;
                  return (
                    <a
                      className="font-bold flex underline"
                      rel="noreferrer"
                      href={attachmentUrl}
                      target="_blank"
                      key={index}
                    >
                      {`${t("layers.esri.detail.showDocument")} ${index + 1}`}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <pre className="p-2 h-72 bg-black text-white overflow-auto">
        <code>{JSON.stringify(feature?.properties, null, 2)}</code>
      </pre> */}
    </>
  );
};

export default Detail;
