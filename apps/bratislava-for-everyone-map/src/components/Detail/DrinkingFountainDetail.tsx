import { z } from "zod";
import { DataDisplay } from "@bratislava/react-maps-ui";

export const drinkingFountainFeaturePropertiesSchema = z.object({
  location: z.string(),
});

type DrinkingFountainProperties = z.infer<typeof drinkingFountainFeaturePropertiesSchema>;

export const DrikingFountainDetail = ({ location }: DrinkingFountainProperties) => {
  return (
    <div className="p-6">
      <DataDisplay label="fontanka" text={location} />
    </div>
  );
};
