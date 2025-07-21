import { z } from "zod";
import { DataDisplay } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";

export const publicToiletFeaturePropertiesSchema = z.object({
  maintainer: z.string().nullable(),
  name: z.string(),
  price: z.string().nullable(),
  openingHours: z.string(),
});

type PublicToiletProperties = z.infer<typeof publicToiletFeaturePropertiesSchema>;

export interface IPublicToiletDetailProps {
  properties: PublicToiletProperties;
}

export const PublicToiletDetail = ({ properties }: IPublicToiletDetailProps) => {
  const { maintainer, name, price, openingHours } = properties;
  const { t } = useTranslation();
  return (
    <div>
      <div className="p-4 flex flex-col gap-4">
        <div className="font-semibold pt-1 pr-12">{t("detail.publicToilet.publicToilet")}</div>
        <DataDisplay label={t("detail.publicToilet.name")} text={name} />
        <DataDisplay label={t("detail.publicToilet.maintainer")} text={maintainer} />
        <DataDisplay label={t("detail.publicToilet.price")} text={price} />
        <DataDisplay label={t("detail.publicToilet.openingHours")} text={openingHours} />
      </div>
    </div>
  );
};
