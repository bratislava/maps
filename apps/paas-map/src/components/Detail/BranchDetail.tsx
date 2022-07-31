import { useTranslation } from "react-i18next";
import { Row } from "./Row";
import { z } from "zod";

export const branchPropertiesSchema = z.object({
  Názov: z.string(),
  Adresa: z.string(),
  "Otváracie hodiny": z.string(),
  Miesto: z.string(),
  "Spresňujúce informácie": z.string().nullable(),
});

export type BranchProperties = z.infer<typeof branchPropertiesSchema>;

export interface BranchDetailProps {
  properties: BranchProperties;
}

export const BranchDetail = ({ properties }: BranchDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.branches.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold">{t("title")}</div>
      <Row label={t("name")} text={properties["Názov"]} />
      <Row label={t("address")} text={properties["Adresa"]} />
      <Row label={t("openingHours")} text={properties["Otváracie hodiny"]} />
      <Row label={t("place")} text={properties["Miesto"]} />
      <Row label={t("additionalInformation")} text={properties["Spresňujúce informácie"]} />
    </div>
  );
};

export default BranchDetail;
