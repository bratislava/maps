import { useTranslation } from "react-i18next";
import { Row } from "./Row";
import { z } from "zod";

export const pPlusRPropertiesSchema = z.object({
  Názov: z.string(),
  "Počet parkovacích miest": z.string(),
  MHD: z.string(),
  "Vzdialenosť MHD": z.string(),
  "Dojazdová doba do centra": z.string(),
});

export type PPlusRProperties = z.infer<typeof pPlusRPropertiesSchema>;

export interface PPlusRDetailProps {
  properties: PPlusRProperties;
}

export const PPlusRDetail = ({ properties }: PPlusRDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.p-plus-r.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("name")} text={properties["Názov"]} />
      <Row label={t("count")} text={properties["Počet parkovacích miest"]} />
      <Row label={t("mhd")} text={properties["MHD"]} />
      <Row label={t("mhdDistance")} text={properties["Vzdialenosť MHD"]} />
      <Row label={t("toCentre")} text={properties["Dojazdová doba do centra"]} />
    </div>
  );
};

export default PPlusRDetail;
