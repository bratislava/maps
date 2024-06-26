/* eslint-disable camelcase */
import { Note } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ButtonLink } from "../ButtonLink";
import { Row } from "./Row";

export const residentPropertiesSchema = z.object({
  Kod_parkovacej_zony: z.string(),
  Informacia_RPK_sk: z.string().nullable().optional(),
  Informacia_RPK_en: z.string().nullable().optional(),
  Status: z.string(),
  zone: z.string().optional(),
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
    <div className="flex flex-col justify-end w-full gap-4 sm:pb-4">
      <div className="font-semibold pb-1">{t("title")}</div>
      {properties.Status === "planned" && <div className="font-semibold">{t("planned")}</div>}
      <Row label={t("cardValidity")} text={properties["Kod_parkovacej_zony"]} />

      {properties["Informacia_RPK_sk"] && (
        <Note className="flex flex-col gap-4 !bg-[#2859CC]/20 dark:!bg-[#2859CC]/20">
          {properties["Informacia_RPK_sk"] && language === "sk" && (
            <div className="font-light">{properties["Informacia_RPK_sk"]}</div>
          )}
          {properties["Informacia_RPK_en"] && language === "en" && (
            <div className="font-light">{properties["Informacia_RPK_en"]}</div>
          )}
        </Note>
      )}

      <div className="relative">
        <div className="sm:fixed -bottom-6">
          <ButtonLink noShadow isSecondary href={t("cardsUrl")} text={t("cards")} />
        </div>
      </div>
    </div>
  );
};

export default ResidentDetail;
