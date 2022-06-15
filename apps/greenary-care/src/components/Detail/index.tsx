import React from "react";
import { Row } from "./Row";
import { useTranslation } from "react-i18next";

export interface DetailProps {
  features: any[];
}

export const Detail = ({ features }: DetailProps) => {
  const { t } = useTranslation();

  if (!(features && features[0])) return null;

  const feature = features[0];

  return (
    <>
      <div className="flex flex-col space-y-4 p-8 pt-4 overflow-auto">
        <div className="flex flex-col space-y-4">
          <div className="font-bold font-md pt-4 text-[20px]">
            {t(`layers.esri.detail.title`)}
          </div>
          <Row
            label={t(`layers.esri.detail.slovakName`)}
            text={feature.properties["Drevina_SK"]}
          />
          <Row
            label={t(`layers.esri.detail.latinName`)}
            text={feature.properties["Drevina_LAT"]}
          />
          <Row
            label={t(`layers.esri.detail.street`)}
            text={feature.properties["ULICA"]}
          />
          <Row
            label={t(`layers.esri.detail.operation`)}
            text={feature.properties["TYP_VYKONU_1"]}
          />
          <Row
            label={t(`layers.esri.detail.description`)}
            text={feature.properties["POPIS_VYKONU_1"]}
          />
          <Row
            label={t(`layers.esri.detail.date`)}
            text={feature.properties["TERMIN_REALIZACIE_1"]}
          />
          <Row
            label={t(`layers.esri.detail.district`)}
            text={feature.properties["district"]}
          />
        </div>
      </div>
      <pre className="p-2 h-72 bg-black text-white overflow-auto">
        <code>{JSON.stringify(feature.properties, null, 2)}</code>
      </pre>
    </>
  );
};

export default Detail;
