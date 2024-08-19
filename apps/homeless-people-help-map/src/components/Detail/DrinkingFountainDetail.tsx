import { z } from "zod";
import { DataDisplay, Image } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";

export const drinkingFountainFeaturePropertiesSchema = z.object({
  buildSince: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  maintainer: z.string(),
  name: z.string(),
  photo: z.object({
    data: z.array(
      z.object({
        id: z.string(),
        attributes: z.object({
          url: z.string(),
        }),
      }),
    ),
  }),
  state: z.string(),
  type: z.string(),
});

type DrinkingFountainProperties = z.infer<typeof drinkingFountainFeaturePropertiesSchema>;

export interface IDrinkingFountainDetailProps {
  properties: DrinkingFountainProperties;
  isMobile: boolean;
}

export const DrinkingFountainDetail = ({ properties, isMobile }: IDrinkingFountainDetailProps) => {
  const { buildSince, maintainer, name, photo, state, type: fountainType } = properties;
  const { t } = useTranslation();
  const image = photo.data[0]?.attributes.url;
  return (
    <div>
      {image && <Image src={image} isMobile={isMobile} />}
      <div className="p-4 flex flex-col gap-4">
        <div className="font-semibold pt-1 pr-12">
          {t("detail.drinkingFountain.drinkingFountain")}
        </div>
        <DataDisplay label={t("detail.drinkingFountain.buildSince")} text={buildSince} />
        <DataDisplay label={t("detail.drinkingFountain.name")} text={name} />
        <DataDisplay label={t("detail.drinkingFountain.maintainer")} text={maintainer} />
        <DataDisplay label={t("detail.drinkingFountain.state")} text={state} />
        <DataDisplay label={t("detail.drinkingFountain.type")} text={fountainType} />
      </div>
    </div>
  );
};
