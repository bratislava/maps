import { useTranslation } from "react-i18next";
import { Row } from "./Row";
import { z } from "zod";

export const parkomatPropertiesSchema = z.object({
  Location: z.string(),
  // eslint-disable-next-line camelcase
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
      <Row label={t("location")} text={properties["Location"]} />
      <Row label={t("parkomatId")} text={properties["Parkomat_ID"]} />
    </div>
  );
};

export default ParkomatDetail;
