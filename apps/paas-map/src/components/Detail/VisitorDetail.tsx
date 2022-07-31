import { useTranslation } from "react-i18next";
import { Row } from "./Row";
import { z } from "zod";
import { Chevron } from "@bratislava/react-maps-icons";

export const visitorPropertiesSchema = z.object({
  Názov: z.string(),
  "UDR ID": z.number(),
  "Informácia RPK": z.string().nullable().optional(),
  "Informácia NPK": z.string().nullable().optional(),
});

export type VisitorProperties = z.infer<typeof visitorPropertiesSchema>;

export interface VisitorDetailProps {
  properties: VisitorProperties;
}

export const VisitorDetail = ({ properties }: VisitorDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.visitors.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("location")} text={properties["Názov"]} />
      <Row label={t("parkingSectionCode")} text={`${properties["UDR ID"]}`} />
      <Row label={t("RPKInfo")} text={properties["Informácia RPK"]} />
      <Row label={t("NPKInfo")} text={properties["Informácia NPK"]} />
      <div>
        <a
          href="https://paas.sk/platba/"
          target="_blank"
          className="bg-primary flex items-center gap-2 rounded-lg text-secondary px-6 absolute -bottom-6 h-12 font-semibold"
          rel="noreferrer"
        >
          <span>Platba</span>
          <Chevron direction="right" size="xs" />
        </a>
      </div>
    </div>
  );
};

export default VisitorDetail;
