/* eslint-disable camelcase */
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ButtonLink } from "../ButtonLink";
import { Row } from "./Row";

export const visitorPropertiesSchema = z.object({
  Názov: z.string(),
  UDR_ID: z.number().nullable(),
  Informacia_RPK_sk: z.string().nullable().optional(),
  Informacia_RPK_en: z.string().nullable().optional(),
  Informacia_NPK_sk: z.string().nullable().optional(),
  Informacia_NPK_en: z.string().nullable().optional(),
  Cas_spoplatnenia_sk: z.string().nullable().optional(),
  Cas_spoplatnenia_en: z.string().nullable().optional(),
  Zakladna_cena: z.number().nullable().optional(),
  Doplnkova_informacia_sk: z.string().nullable().optional(),
  Doplnkova_informacia_en: z.string().nullable().optional(),
  Vyhradene_sk: z.string().nullable().optional(),
  Vyhradene_en: z.string().nullable().optional(),
  Kód_rezid: z.string().nullable().optional(),
});

export type VisitorProperties = z.infer<typeof visitorPropertiesSchema>;

export interface VisitorDetailProps {
  properties: VisitorProperties;
}

export const VisitorDetail = ({ properties }: VisitorDetailProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("translation", { keyPrefix: "layers.visitors.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("location")} text={properties["Názov"]} />
      <Row label={t("parkingSectionCode")} text={`${properties["UDR_ID"]}`} />
      <Row
        label={t("price")}
        text={properties["Zakladna_cena"] ? `${properties["Zakladna_cena"]?.toFixed(2)} €` : null}
      />
      <Row
        text={language === "sk" ? properties["Informacia_RPK_sk"] : properties["Informacia_RPK_en"]}
      />
      <Row
        text={language === "sk" ? properties["Informacia_NPK_sk"] : properties["Informacia_NPK_en"]}
      />
      <Row
        label={t("chargingTime")}
        text={
          language === "sk" ? properties["Cas_spoplatnenia_sk"] : properties["Cas_spoplatnenia_en"]
        }
      />
      <div className="relative">
        <div className="sm:absolute -bottom-12">
          <ButtonLink noShadow href={t("paymentUrl")} text={t("payment")} />
        </div>
      </div>
    </div>
  );
};

export default VisitorDetail;
