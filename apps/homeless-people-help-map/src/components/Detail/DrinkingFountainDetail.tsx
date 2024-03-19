import { z } from "zod";
import { DataDisplay } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";

export const drinkingFountainFeaturePropertiesSchema = z.object({
  location: z.string(),
});

type DrinkingFountainProperties = z.infer<typeof drinkingFountainFeaturePropertiesSchema>;

export const DrinkingFountainDetail = ({ location }: DrinkingFountainProperties) => {
  const { t } = useTranslation();
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="font-semibold pt-1 pr-12">
        {t("detail.drinkingFountain.drinkingFountain")}
      </div>
      <DataDisplay label={t("detail.drinkingFountain.location")} text={location} />
    </div>
  );
};
