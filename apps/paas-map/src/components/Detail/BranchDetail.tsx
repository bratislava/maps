/* eslint-disable camelcase */
import { Note } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Row } from "./Row";

export const branchPropertiesSchema = z.object({
  Nazov: z.string(),
  Miesto: z.string(),
  Adresa: z.string(),
  Otvaracie_hodiny_sk: z.string().nullable(),
  Otvaracie_hodiny_en: z.string().nullable(),
  Spresnujuce_informacie_sk: z.string().nullable(),
  Spresnujuce_informacie_en: z.string().nullable(),
  Navigacia: z.string().nullable(),
});

export type BranchProperties = z.infer<typeof branchPropertiesSchema>;

export interface BranchDetailProps {
  properties: BranchProperties;
}

export const BranchDetail = ({ properties }: BranchDetailProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("translation", { keyPrefix: "layers.branches.detail" });

  return (
    <div className="flex flex-col justify-end w-full gap-4">
      <div className="font-semibold pb-1">{t("title")}</div>
      <Row label={t("name")} text={properties["Nazov"]} />
      <Row label={t("address")} text={properties["Adresa"]} />
      <Row
        label={t("openingHours")}
        text={
          language === "sk" ? properties["Otvaracie_hodiny_sk"] : properties["Otvaracie_hodiny_en"]
        }
      />
      <Row label={t("place")} text={properties["Miesto"]} />
      {properties["Spresnujuce_informacie_sk"] && (
        <Note>
          <Row
            label={t("additionalInformation")}
            text={
              language === "sk"
                ? properties["Spresnujuce_informacie_sk"]
                : properties["Spresnujuce_informacie_en"]
            }
          />
        </Note>
      )}
    </div>
  );
};

export default BranchDetail;
