/* eslint-disable camelcase */
import { z } from "zod";
import { DataDisplay } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";

export const fixpointSyringeExchangeFeaturePropertiesSchema = z.object({
  name: z.string(),
  address: z.string(),
});

type FixpointSyringeExchangeProperties = z.infer<
  typeof fixpointSyringeExchangeFeaturePropertiesSchema
>;

export const FixpointSyringeExchangeDetail = ({
  name,
  address,
}: FixpointSyringeExchangeProperties) => {
  const { t } = useTranslation();
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="font-semibold pt-1 pr-12">{name}</div>
      <DataDisplay label={t("detail.fixpointSyringeExchange.address")} text={address} />
    </div>
  );
};
