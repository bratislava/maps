/* eslint-disable camelcase */
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ButtonLink } from "../ButtonLink";
import { Row } from "./Row";

export const residentPropertiesSchema = z.object({
  Kód_parko: z.string(),
  Informacia_RPK_sk: z.string().nullable().optional(),
  Informacia_RPK_en: z.string().nullable().optional(),
});

export type ResidentProperties = z.infer<typeof residentPropertiesSchema>;

export interface ResidentDetailProps {
  properties: ResidentProperties;
}

export const ResidentDetail = ({ properties }: ResidentDetailProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("translation", { keyPrefix: "layers.residents.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("cardValidity")} text={properties["Kód_parko"]} />

      {properties["Informacia_RPK_sk"] && (
        <div className="font-light text-[14px]">
          {language === "sk" ? properties["Informacia_RPK_sk"] : properties["Informacia_RPK_en"]}
        </div>
      )}

      <div className="relative">
        <div className="absolute -bottom-12">
          <ButtonLink isSecondary href="https://paas.sk/som-rezident/" text="Karty" />
        </div>
      </div>
    </div>
  );
};

export default ResidentDetail;
