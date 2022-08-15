/* eslint-disable camelcase */
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Row } from "./Row";

export const parkomatPropertiesSchema = z.object({
  Lokalita: z.string(),
  Parkomat_ID: z.string(),
});

export type ParkomatProperties = z.infer<typeof parkomatPropertiesSchema>;

export interface ParkomatDetailProps {
  properties: ParkomatProperties;
}

export const ParkomatDetail = ({ properties }: ParkomatDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.parkomats.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("location")} text={properties["Lokalita"]} />
      <Row label={t("parkomatId")} text={properties["Parkomat_ID"]} />
    </div>
  );
};

export default ParkomatDetail;
