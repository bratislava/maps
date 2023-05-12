/* eslint-disable camelcase */
import { Note } from "@bratislava/react-maps-ui";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Row } from "./Row";

export const parkingLotPropertiesSchema = z.object({
  Nazov_sk: z.string(),
  Nazov_en: z.string(),
  Typ_sk: z.string(),
  Typ_en: z.string(),
  Stav_sk: z.string(),
  Stav_en: z.string(),
  Povrch_sk: z.string(),
  Povrch_en: z.string(),
  Navigacia: z.string().nullable(),
  Prevadzkova_doba: z.string().nullable(),
  Informacia_RPK_sk: z.string().nullable(),
  Informacia_RPK_en: z.string().nullable(),
  Informacia_NPK_sk: z.string().nullable(),
  Informacia_NPK_en: z.string().nullable(),
  Adresa: z.string().nullable(),
  Pocet_parkovacich_miest: z.string().nullable(),
  Verejna_doprava: z.string().nullable(),
  Vzdialenost: z.string().nullable(),
  Dojazdova_doba: z.string().nullable(),
  icon: z.enum(["garage", "p-plus-r", "parking-lot"]),
});

export type ParkingLotProperties = z.infer<typeof parkingLotPropertiesSchema>;

export interface ParkingLotDetailProps {
  properties: ParkingLotProperties;
}

export const ParkingLotDetail = ({ properties }: ParkingLotDetailProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("translation", { keyPrefix: "layers.parking-lots.detail" });

  const infoColorClass = properties["Stav_en"] !== 'inactive' ? 'bg-primary/20 dark:bg-primary/20' : 'bg-[#FAE5E5] dark:bg-[#FAE5E5]'

  const title = useMemo(() => {
    return t(`title.${properties.icon}`);
  }, [t, properties.icon]);

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold pb-1">{title}</div>
      <Row
        label={t("name")}
        text={language === "sk" ? properties["Nazov_sk"] : properties["Nazov_en"]}
      />

      <Row label={t("operatingTime")} text={properties["Prevadzkova_doba"]} />

      <Row label={t("address")} text={properties["Adresa"]} />
      <Row label={t("count")} text={properties["Pocet_parkovacich_miest"]} />
      <Row label={t("mhd")} text={properties["Verejna_doprava"]} />
      <Row label={t("mhdDistance")} text={properties["Vzdialenost"]} />
      <Row label={t("toCentre")} text={properties["Dojazdova_doba"]} />

      {(properties["Informacia_RPK_sk"] || properties["Informacia_NPK_sk"]) && (
        <Note className={infoColorClass}>
          {properties["Informacia_RPK_sk"] && (
            <div className="font-light text-[14px]">
              {language === "sk"
                ? properties["Informacia_RPK_sk"]
                : properties["Informacia_RPK_en"]}
            </div>
          )}
          {properties["Informacia_NPK_sk"] && (
            <div className="font-light text-[14px]">
              {language === "sk"
                ? properties["Informacia_NPK_sk"]
                : properties["Informacia_NPK_en"]}
            </div>
          )}
        </Note>
      )}
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

export default ParkingLotDetail;
