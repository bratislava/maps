/* eslint-disable camelcase */
import { Information } from "@bratislava/react-maps-icons";
import { Note, Popover } from "@bratislava/react-maps-ui";
import { Trans, useTranslation } from "react-i18next";
import { z } from "zod";
import { ButtonLink } from "../ButtonLink";
import { Row } from "./Row";

export const visitorPropertiesSchema = z.object({
  nazov: z.string(),
  udr_id: z.number().nullable(),
  informacia_rpk_sk: z.string().nullable().optional(),
  informacia_rpk_en: z.string().nullable().optional(),
  informacia_npk_sk: z.string().nullable().optional(),
  informacia_npk_en: z.string().nullable().optional(),
  cas_spoplatnenia_sk: z.string().nullable().optional(),
  cas_spoplatnenia_en: z.string().nullable().optional(),
  zakladna_cena: z.number().nullable().optional(),
  vikendy_a_sviatky: z.number().nullable().optional(),
  doplnkova_informacia_sk: z.string().nullable().optional(),
  doplnkova_informacia_en: z.string().nullable().optional(),
  vyhradene_park_statie_sk: z.string().nullable().optional(),
  vyhradene_park_statie_en: z.string().nullable().optional(),
  kod_rezidentskej_zony: z.string().nullable().optional(),
  status: z.string(),
  zone: z.string().optional(),
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
    <div className="flex flex-col justify-end w-full gap-4 sm:pb-4">
      <div className="font-semibold pb-1">{t("title")}</div>
      {properties.status === "planned" && <div className="font-semibold">{t("planned")}</div>}
      <Row label={t("location")} text={properties["nazov"]} />
      <Row label={t("parkingSectionCode")} text={`${properties["udr_id"]}`} />
      <Row
        label={t("chargingTime")}
        text={
          language === "sk" ? properties["cas_spoplatnenia_sk"] : properties["cas_spoplatnenia_en"]
        }
      />
      <Row
        label={t("price")}
        text={
          properties["zakladna_cena"] ? `${properties["zakladna_cena"]?.toFixed(2)} € / h` : null
        }
      />
      <Row
        label={t("priceWeekend")}
        text={
          properties["vikendy_a_sviatky"]
            ? `${properties["vikendy_a_sviatky"]?.toFixed(2)} € / h`
            : null
        }
      />

      {(properties["informacia_rpk_sk"] ||
        properties["informacia_npk_sk"] ||
        properties["doplnkova_informacia_sk"]) && (
        <Note className="flex flex-col gap-4 bg-primary/20 dark:bg-primary/20">
          {properties["informacia_rpk_sk"] && language === "sk" && (
            <div className="font-light">{properties["informacia_rpk_sk"]}</div>
          )}

          {properties["informacia_rpk_en"] && language === "en" && (
            <div className="font-light">{properties["informacia_rpk_en"]}</div>
          )}

          {properties["informacia_npk_sk"] && language === "sk" && (
            <div className="font-light">{properties["informacia_npk_sk"]}</div>
          )}

          {properties["informacia_npk_en"] && language === "en" && (
            <div className="font-light">{properties["informacia_npk_en"]}</div>
          )}
          {properties["doplnkova_informacia_sk"] && language === "sk" && (
            <div className="font-light">
              {properties["doplnkova_informacia_sk"]}{" "}
              {(properties["doplnkova_informacia_sk"]?.includes("bonus") ||
                properties["doplnkova_informacia_sk"]?.includes("Bonus")) && (
                <Popover
                  allowedPlacements={["bottom", "top", "left"]}
                  button={({ toggle }) => (
                    <span className="cursor-pointer transform" onClick={toggle}>
                      <Information
                        className="inline-block text-primary translate-y-1"
                        size="default"
                      />
                    </span>
                  )}
                  panel={
                    <div className="flex flex-col gap-2 w-[248px]">
                      <span>
                        <Trans t={t} i18nKey="additionalInfo">
                          before
                          <a
                            className="underline text-secondary font-semibold dark:text-primary"
                            href={t("additionalInfoUrl")}
                            target="_blank"
                            rel="noreferrer"
                          >
                            link text
                          </a>
                        </Trans>
                      </span>
                    </div>
                  }
                />
              )}
            </div>
          )}
          {properties["doplnkova_informacia_en"] && language === "en" && (
            <div className="font-light">
              {properties["doplnkova_informacia_en"]}{" "}
              {(properties["doplnkova_informacia_en"]?.includes("bonus") ||
                properties["doplnkova_informacia_en"]?.includes("Bonus")) && (
                <Popover
                  allowedPlacements={["bottom", "top", "left"]}
                  button={({ toggle }) => (
                    <span className="cursor-pointer transform" onClick={toggle}>
                      <Information
                        className="inline-block text-primary translate-y-1 dark:text-primary"
                        size="default"
                      />
                    </span>
                  )}
                  panel={
                    <div className="flex flex-col gap-2 w-[248px]">
                      <span>
                        <Trans t={t} i18nKey="additionalInfo">
                          before
                          <a
                            className="underline text-secondary font-semibold"
                            href={t("additionalInfoUrl")}
                            target="_blank"
                            rel="noreferrer"
                          >
                            link text
                          </a>
                        </Trans>
                      </span>
                    </div>
                  }
                />
              )}
            </div>
          )}
        </Note>
      )}
      <div className="relative">
        <div className="sm:fixed -bottom-6">
          <ButtonLink noShadow href={t("paymentUrl")} text={t("payment")} />
        </div>
      </div>
    </div>
  );
};

export default VisitorDetail;
