import { useTranslation } from "react-i18next";
import { Row } from "./Row";
import { z } from "zod";

export const partnerPropertiesSchema = z.object({
  Názov: z.string(),
  Adresa: z.string(),
  "Otváracie hodiny": z.string(),
});

export type PartnerProperties = z.infer<typeof partnerPropertiesSchema>;

export interface PartnerDetailProps {
  properties: PartnerProperties;
}

export const PartnerDetail = ({ properties }: PartnerDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.partners.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("name")} text={properties["Názov"]} />
      <Row label={t("address")} text={properties["Adresa"]} />
      <Row label={t("openingHours")} text={properties["Otváracie hodiny"]} />
    </div>
  );
};

export default PartnerDetail;
