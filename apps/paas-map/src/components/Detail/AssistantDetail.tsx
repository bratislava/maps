import { useTranslation } from "react-i18next";
import { Row } from "./Row";
import { z } from "zod";

export const assistantPropertiesSchema = z.object({
  "Rezidentská zóna": z.string(),
});

export type AssistantProperties = z.infer<typeof assistantPropertiesSchema>;

export interface AssistantDetailProps {
  properties: AssistantProperties;
}

export const AssistantDetail = ({ properties }: AssistantDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.assistants.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("residentZone")} text={properties["Rezidentská zóna"]} />
    </div>
  );
};

export default AssistantDetail;
