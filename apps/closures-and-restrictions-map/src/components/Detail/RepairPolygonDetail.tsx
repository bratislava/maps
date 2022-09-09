/* eslint-disable camelcase */
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ReactComponent as HintIcon } from "../../assets/icons/hint.svg";
import { DetailValue } from "./DetailValue";
import { Row } from "./Row";

export const repairPolygonPropertiesSchema = z.object({
  location: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  length: z.number().optional(),
  fullSize: z.number().optional(),
  layer: z.string(),
});

export type RepairPolygonDetailProperties = z.infer<typeof repairPolygonPropertiesSchema>;

export interface RepairPolygonDetailProps {
  properties: RepairPolygonDetailProperties;
}

export const RepairPolygonDetail = ({ properties }: RepairPolygonDetailProps) => {
  const {
    t,
    // i18n: { language },
  } = useTranslation("translation", { keyPrefix: `layers.repairs.detail` });

  // const date = useMemo(() => {
  //   return properties.timestamp
  //     ? new Date(properties.timestamp).toLocaleString(language, {
  //         day: "numeric",
  //         year: "numeric",
  //         month: "numeric",
  //       })
  //     : undefined;
  // }, [properties.timestamp, language]);

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <DetailValue>{t("title")}</DetailValue>
      <Row label={t("location")} text={properties.location} />
      <Row label={t("address")} text={properties.address} />
      <Row label={t("description")} text={properties.description} />
      <Row label={t("length")} text={properties.length} />
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
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <HintIcon />
        </div>
        <div className="flex-1">{t("problemHint")}</div>
      </div>
      <a
        href={t("reportProblemLink")}
        target="_blank"
        className="underline font-semibold"
        rel="noreferrer"
      >
        {t("reportProblem")}
      </a>
    </div>
  );
};

export default RepairPolygonDetail;
