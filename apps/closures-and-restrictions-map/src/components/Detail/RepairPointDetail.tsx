/* eslint-disable camelcase */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ReactComponent as HintIcon } from "../../assets/icons/hint.svg";
import { DetailValue } from "./DetailValue";
import { Row } from "./Row";

export const repairPointPropertiesSchema = z.object({
  location: z.string().optional(),
  timestamp: z.number().optional(),
  layer: z.string(),
});

export type RepairPointDetailProperties = z.infer<typeof repairPointPropertiesSchema>;

export interface RepairPointDetailProps {
  properties: RepairPointDetailProperties;
}

export const RepairPointDetail = ({ properties }: RepairPointDetailProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("translation", { keyPrefix: `layers.repairs.detail` });

  const date = useMemo(() => {
    return properties.timestamp
      ? new Date(properties.timestamp).toLocaleString(language, {
          day: "numeric",
          year: "numeric",
          month: "numeric",
        })
      : undefined;
  }, [properties.timestamp, language]);

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <DetailValue>{t("title")}</DetailValue>
      <Row label={t("location")} text={properties.location} />
      <Row label={t("date")} text={date} />
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <HintIcon />
        </div>
        <div className="flex-1">{t("problemHint")}</div>
      </div>
      <a
        href="https://bratislava.sk"
        target="_blank"
        className="underline font-semibold"
        rel="noreferrer"
      >
        {t("reportProblem")}
      </a>
    </div>
  );
};

export default RepairPointDetail;
