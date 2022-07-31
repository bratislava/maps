import { useTranslation } from "react-i18next";
import { Row } from "./Row";
import { z } from "zod";
import { Chevron } from "@bratislava/react-maps-icons";

export const residentPropertiesSchema = z.object({
  "Kód parkovacej zóny": z.string(),
  "Informácia RPK": z.string().nullable().optional(),
});

export type ResidentProperties = z.infer<typeof residentPropertiesSchema>;

export interface ResidentDetailProps {
  properties: ResidentProperties;
}

export const ResidentDetail = ({ properties }: ResidentDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.residents.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("cardValidity")} text={properties["Kód parkovacej zóny"]} />
      <Row label={t("additionalInformation")} text={properties["Informácia RPK"]} />
      <div>
        <a
          href="https://paas.sk/som-rezident/"
          target="_blank"
          className="text-primary flex items-center gap-2 rounded-lg bg-secondary px-6 absolute -bottom-6 h-12 font-semibold"
          rel="noreferrer"
        >
          <span>Karty</span>
          <Chevron direction="right" size="xs" />
        </a>
      </div>
    </div>
  );
};

export default ResidentDetail;
