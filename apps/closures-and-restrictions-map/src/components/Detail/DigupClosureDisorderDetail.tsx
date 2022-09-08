/* eslint-disable camelcase */
import { useArcgisAttachments } from "@bratislava/react-use-arcgis";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ReactComponent as HintIcon } from "../../assets/icons/hint.svg";
import { DIGUPS_URL } from "../../utils/urls";
import { DetailValue } from "./DetailValue";
import { Row } from "./Row";

export const digupClosureDisorderPropertiesSchema = z.object({
  objectId: z.number(),
  subject: z.string().optional(),
  type: z.array(z.string()).optional(),
  address: z.string().optional(),
  startTimestamp: z.number().optional(),
  endTimestamp: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  fullSize: z.number().optional(),
  investor: z.string().optional(),
  contractor: z.string().optional(),
  layer: z.string(),
});

export type DigupClosureDisorderProperties = z.infer<typeof digupClosureDisorderPropertiesSchema>;

export interface DigupClosureDisorderDetailProps {
  properties: DigupClosureDisorderProperties;
}

export const DigupClosureDisorderDetail = ({ properties }: DigupClosureDisorderDetailProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("translation", { keyPrefix: `layers.${properties.layer}.detail` });

  const { t: mainT } = useTranslation();

  const { data: attachments } = useArcgisAttachments(DIGUPS_URL, properties.objectId);

  const startDate = useMemo(() => {
    return new Date(properties.startTimestamp ?? 0).toLocaleString(language, {
      day: "numeric",
      year: "numeric",
      month: "numeric",
    });
  }, [properties.startTimestamp, language]);

  const endDate = useMemo(() => {
    return new Date(properties.endTimestamp ?? 0).toLocaleString(language, {
      day: "numeric",
      year: "numeric",
      month: "numeric",
    });
  }, [properties.endTimestamp, language]);

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <DetailValue>{t("title")}</DetailValue>
      <DetailValue>{properties.subject}</DetailValue>
      <Row label={t("address")} text={properties.address} />
      <Row
        label={t("category")}
        tags={properties.type?.map((type) => mainT(`filters.type.types.${type}`)) ?? []}
      />
      <Row label={t("startDate")} text={startDate} />
      <Row label={t("endDate")} text={endDate} />
      {properties.fullSize && (
        <Row
          label={t("fullSize")}
          text={
            <span>
              {`${properties.fullSize} m`}
              <sup>2</sup>
            </span>
          }
        />
      )}
      {properties.length && <Row label={t("length")} text={`${properties.length} m`} />}
      {properties.width && <Row label={t("width")} text={`${properties.width} m`} />}
      <Row label={t("investor")} text={properties.investor} />
      <Row label={t("contractor")} text={properties.contractor} />

      {attachments && !!attachments.length && (
        <div>
          <div>{t("permission")}</div>
          <div>
            {attachments.map((attachment, index) => {
              console.log(attachment);
              const attachmentUrl = `${DIGUPS_URL}/${properties.objectId}/attachment/${attachment.id}`;
              return (
                <a
                  className="font-bold flex underline"
                  rel="noreferrer"
                  href={attachmentUrl}
                  target="_blank"
                  key={index}
                >
                  {`${t("showDocument")} ${attachments.length > 1 ? index + 1 : ""}`}
                </a>
              );
            })}
          </div>
        </div>
      )}

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

export default DigupClosureDisorderDetail;
