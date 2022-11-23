import { useRef, useState, useEffect } from "react";
import { Feature } from "geojson";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import { useTranslation } from "react-i18next";
import { useArcgisAttachments } from "@bratislava/react-use-arcgis";
import { X } from "@bratislava/react-maps-icons";
import { DataDisplay } from "@bratislava/react-maps-ui";

export interface DetailProps {
  features: Feature[];
  onClose: () => void;
  isMobile: boolean;
  arcgisServerUrl: string;
}

export const Detail = ({ features, onClose, isMobile, arcgisServerUrl }: DetailProps) => {
  const { t, i18n }: { t: (key: string) => string; i18n: { language: string } } = useTranslation();

  const sheetRef = useRef<BottomSheetRef>(null);

  const [feature, setFeature] = useState<Feature | null>(null);
  const [objectId, setObjectId] = useState<string | number | null>(null);

  useEffect(() => {
    setFeature(null);
    setObjectId(null);

    const firstFeature = features[0];
    if (firstFeature) {
      setFeature(firstFeature);
      sheetRef.current?.snapTo(({ snapPoints }) => snapPoints[1]);
      if (firstFeature.properties?.["OBJECTID"]) setObjectId(firstFeature.properties?.["OBJECTID"]);
    }
  }, [features, setObjectId]);

  const { data: attachments } = useArcgisAttachments(arcgisServerUrl, objectId);

  // const [currentSnap, setCurrentSnap] = useState(0);

  // const onSnapChange = useCallback(() => {
  //   requestAnimationFrame(() => setCurrentSnap(sheetRef.current?.height === 84 ? 1 : 0));
  // }, []);

  if (!feature) return null;

  const detail = (
    <div className="flex flex-col space-y-4 p-8 pt-0 sm:pt-4 overflow-auto">
      <button className="hidden sm:block absolute right-4 top-8 p-2" onClick={onClose}>
        <X />
      </button>
      <div className="flex flex-col space-y-4">
        <div className="first-letter:uppercase font-bold font-md text-[20px]">
          {feature?.properties?.["TYP_VYKONU_1"]
            ? t(`categories.${feature?.properties?.["TYP_VYKONU_1"]}`)
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
    </div>
  );

  return isMobile ? (
    <BottomSheet
      ref={sheetRef}
      snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 2, 84]}
      defaultSnap={({ snapPoints }) => snapPoints[1]}
      blocking={false}
      // onSpringStart={onSnapChange}
      className="relative z-30"
      open={true}
      expandOnContentDrag
    >
      {detail}
    </BottomSheet>
  ) : (
    detail
  );
};

export default Detail;
