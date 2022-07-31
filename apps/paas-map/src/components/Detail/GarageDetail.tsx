import { useTranslation } from "react-i18next";
import { Row } from "./Row";
import { z } from "zod";

export const garagePropertiesSchema = z.object({
  Name: z.string(),
  Adresa: z.string(),
  "Informácia RPK": z.string().nullable(),
  "Informácia NPK": z.string().nullable(),
});

export type GarageProperties = z.infer<typeof garagePropertiesSchema>;

export interface GarageDetailProps {
  properties: GarageProperties;
}

export const GarageDetail = ({ properties }: GarageDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.garages.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("name")} text={properties["Name"]} />
      <Row label={t("address")} text={properties["Adresa"]} />
      <Row text={properties["Informácia RPK"]} />
      <Row text={properties["Informácia NPK"]} />
    </div>
  );
};

export default GarageDetail;
