/* eslint-disable camelcase */
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Row } from "./Row";

export const assistantPropertiesSchema = z.object({
  Rezidentska_zona: z.string(),
  Interny_nazov: z.string(),
});

export type AssistantProperties = z.infer<typeof assistantPropertiesSchema>;

export interface AssistantDetailProps {
  properties: AssistantProperties;
}

export const AssistantDetail = ({ properties }: AssistantDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.assistants.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold pb-1">{t("title")}</div>
      <Row label={t("residentZone")} text={properties["Rezidentska_zona"]} />
    </div>
  );
};

export default AssistantDetail;
