import { useRef, useState, useEffect } from "react";
import { Feature } from "geojson";
import { useTranslation } from "react-i18next";
import { useArcgisAttachments } from "@bratislava/react-use-arcgis";
import { DataDisplay, SheetHandle } from "@bratislava/react-maps-ui";
import { Detail as MapDetail } from "@bratislava/react-maps";

export interface DetailProps {
  features: Feature[];
  onClose: () => void;
  isMobile?: boolean;
  arcgisServerUrl: string;
}

export const Detail = ({ features, onClose, isMobile, arcgisServerUrl }: DetailProps) => {
  const { t, i18n } = useTranslation();

  const sheetRef = useRef<SheetHandle>(null);

  const [feature, setFeature] = useState<Feature | null>(null);
  const [objectId, setObjectId] = useState<string | number | null>(null);

  useEffect(() => {
    setFeature(null);
    setObjectId(null);

    const firstFeature = features[0];
    if (firstFeature) {
      setFeature(firstFeature);
      sheetRef.current?.snapTo(1);
      if (firstFeature.properties?.["OBJECTID"]) setObjectId(firstFeature.properties?.["OBJECTID"]);
    }
  }, [features, setObjectId]);

  const { data: attachments } = useArcgisAttachments(arcgisServerUrl, objectId);

  if (!feature) return null;

  const detail = (
    <div className="flex flex-col space-y-4 p-8 pt-6">
      <div className="first-letter:uppercase font-bold font-md text-[20px]">
        {feature?.properties?.["TYP_VYKONU_1"]
          ? // https://www.i18next.com/overview/typescript#type-error-template-literal
            t(`categories.${feature?.properties?.["TYP_VYKONU_1"]}` as any)
          : t(`layers.esri.detail.title`)}
      </div>
      <DataDisplay
        label={t(`layers.esri.detail.slovakName`)}
        text={feature?.properties?.["Drevina_SK"]}
      />
      <DataDisplay
        label={t(`layers.esri.detail.latinName`)}
        text={feature?.properties?.["Drevina_LAT"]}
      />
      <DataDisplay label={t(`layers.esri.detail.street`)} text={feature?.properties?.["ULICA"]} />
      <DataDisplay
        label={t(`layers.esri.detail.description`)}
        text={feature?.properties?.["POPIS_VYKONU_1"]}
      />
      {feature?.properties?.["TERMIN_REAL_1"] && (
        <DataDisplay
          label={t(`layers.esri.detail.date`)}
          text={new Date(feature?.properties?.["TERMIN_REAL_1"]).toLocaleString(i18n.language, {
            year: "numeric",
            day: "numeric",
            month: "numeric",
          })}
        />
      )}
      <DataDisplay
        label={t(`layers.esri.detail.district`)}
        text={feature?.properties?.["district"]}
      />

      {attachments && !!attachments.length && (
        <div>
          <div>{t(`layers.esri.detail.document`)}</div>
          <div>
            {attachments.map((attachment, index) => {
              const attachmentUrl = `${arcgisServerUrl}/${objectId}/attachment/${attachment.id}`;
              return (
                <a
                  className="font-bold flex underline"
                  rel="noreferrer"
                  href={attachmentUrl}
                  target="_blank"
                  key={index}
                >
                  {`${t("layers.esri.detail.showDocument")} ${
                    attachments.length > 1 ? index + 1 : ""
                  }`}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <MapDetail
      ref={sheetRef}
      isBottomSheet={isMobile}
      onClose={onClose}
      isVisible={!!feature}
      bottomSheetSnapPoints={[84, "50%", "100%"]}
      bottomSheetInitialSnap={1}
    >
      {feature?.properties && detail}
    </MapDetail>
  );
};

export default Detail;
