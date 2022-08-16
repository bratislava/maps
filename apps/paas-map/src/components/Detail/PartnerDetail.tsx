/* eslint-disable camelcase */
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Row } from "./Row";

export const partnerPropertiesSchema = z.object({
  Nazov: z.string(),
  adresa: z.string().nullable().optional(),
  Otvaracie_hodiny_sk: z.string().nullable().optional(),
  Otvaracie_hodiny_en: z.string().nullable().optional(),
  Navigacia: z.string(),
});

export type PartnerProperties = z.infer<typeof partnerPropertiesSchema>;

export interface PartnerDetailProps {
  properties: PartnerProperties;
}

export const PartnerDetail = ({ properties }: PartnerDetailProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("translation", { keyPrefix: "layers.partners.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold pb-1">{t("title")}</div>
      <Row label={t("name")} text={properties["Nazov"]} />
      <Row label={t("address")} text={properties["adresa"]} />
      <Row
        label={t("openingHours")}
        text={
          language === "sk" ? properties["Otvaracie_hodiny_sk"] : properties["Otvaracie_hodiny_en"]
        }
      />
      {properties.Navigacia && (
        <div>
          <a
            className="underline font-semibold text-secondary dark:text-primary"
            href={properties.Navigacia}
            target="_blank"
            rel="noreferrer"
          >
            {t("navigate")}
          </a>
        </div>
      )}
    </div>
  );
};

export default PartnerDetail;
