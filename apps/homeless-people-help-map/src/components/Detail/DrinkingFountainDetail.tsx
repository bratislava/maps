import { z } from "zod";
import { DataDisplay } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";

export const drinkingFountainFeaturePropertiesSchema = z.object({
  location: z.string(),
});

type DrinkingFountainProperties = z.infer<typeof drinkingFountainFeaturePropertiesSchema>;

export const DrikingFountainDetail = ({ location }: DrinkingFountainProperties) => {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <DataDisplay label={t("detail.drinkingFountain.location")} text={location} />
    </div>
  );
};
