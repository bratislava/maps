/* eslint-disable camelcase */
import { z } from "zod";
import { DataDisplay } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";

export const fixpointSyringeExchangeFeaturePropertiesSchema = z.object({
  name_sk: z.string(),
  name_en: z.string(),
  address_sk: z.string(),
  address_en: z.string(),
});

type FixpointSyringeExchangeProperties = z.infer<
  typeof fixpointSyringeExchangeFeaturePropertiesSchema
>;

export const FixpointSyringeExchangeDetail = ({
  name_sk,
  name_en,
  address_sk,
  address_en,
}: FixpointSyringeExchangeProperties) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="font-semibold pt-1 pr-12">{language === "sk" ? name_sk : name_en}</div>
      <DataDisplay
        label={t("detail.fixpointSyringeExchange.address")}
        text={language === "sk" ? address_sk : address_en}
      />
    </div>
  );
};
