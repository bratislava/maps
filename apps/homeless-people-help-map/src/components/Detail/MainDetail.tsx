/* eslint-disable camelcase */
import { Accordion, AccordionItem, DataDisplay, Divider, Tag } from "@bratislava/react-maps-ui";
import cx from "classnames";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { colors } from "../../utils/colors";
import DetailWebRow from "./DetailWebRow";

export const mainFeaturePropertiesSchema = z.object({
  layerName: z.string(),
  counseling_en: z.string(),
  counseling_sk: z.string(),
  hygiene_en: z.string(),
  hygiene_sk: z.string(),
  overnight_en: z.string(),
  overnight_sk: z.string(),
  drugsAndSex_en: z.string(),
  drugsAndSex_sk: z.string(),
  meals_en: z.string(),
  meals_sk: z.string(),
  medicalTreatment_en: z.string(),
  medicalTreatment_sk: z.string(),
  culture_en: z.string(),
  culture_sk: z.string(),
  isCounseling: z.boolean(),
  isHygiene: z.boolean(),
  isOvernight: z.boolean(),
  isDrugsAndSex: z.boolean(),
  isMeals: z.boolean(),
  isMedicalTreatment: z.boolean(),
  isCulture: z.boolean(),
  name_en: z.string(),
  name_sk: z.string(),
  provider_en: z.string(),
  provider_sk: z.string(),
  address_en: z.string(),
  address_sk: z.string(),
  howToGetThere_en: z.string(),
  howToGetThere_sk: z.string(),
  phone: z.string(),
  email: z.string(),
  web: z.string(),
  navigate: z.string(),
});

type MainProperties = z.infer<typeof mainFeaturePropertiesSchema>;

export interface IMainDetailProps {
  properties: MainProperties;
  className?: string;
  isExpanded: boolean;
  isMobile: boolean;
}

export const MainDetail = ({ properties, className, isExpanded, isMobile }: IMainDetailProps) => {
  const {
    t: detailT,
    i18n: { language },
  } = useTranslation("translation", { keyPrefix: "detail.main" });
  const { t: layersT } = useTranslation("translation", { keyPrefix: "layers" });
  const { t: mainT } = useTranslation();

  const isSomeService = useMemo(() => {
    return !!(
      properties.isCounseling ||
      properties.isHygiene ||
      properties.isOvernight ||
      properties.isMeals ||
      properties.isMedicalTreatment ||
      properties.isCulture ||
      properties.isDrugsAndSex
    );
  }, [properties]);

  const moreInformation = useMemo(() => {
    return (
      <>
        {properties.isCounseling && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`counseling`)}</div>}
            text={language === "sk" ? properties.counseling_sk : properties.counseling_en}
          />
        )}
        {properties.isHygiene && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`hygiene`)}</div>}
            text={language === "sk" ? properties.hygiene_sk : properties.hygiene_en}
          />
        )}
        {properties.isOvernight && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`overnight`)}</div>}
            text={language === "sk" ? properties.overnight_sk : properties.overnight_en}
          />
        )}
        {properties.isMeals && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`meals`)}</div>}
            text={language === "sk" ? properties.meals_sk : properties.meals_en}
          />
        )}
        {properties.isMedicalTreatment && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`medicalTreatment`)}</div>}
            text={
              language === "sk" ? properties.medicalTreatment_sk : properties.medicalTreatment_en
            }
          />
        )}
        {properties.isCulture && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`culture`)}</div>}
            text={language === "sk" ? properties.culture_sk : properties.culture_en}
          />
        )}
        {properties.isDrugsAndSex && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`drugsAndSex`)}</div>}
            text={language === "sk" ? properties.drugsAndSex_sk : properties.drugsAndSex_en}
          />
        )}
      </>
    );
  }, [
    language,
    layersT,
    properties.counseling_en,
    properties.counseling_sk,
    properties.culture_en,
    properties.culture_sk,
    properties.drugsAndSex_en,
    properties.drugsAndSex_sk,
    properties.hygiene_en,
    properties.hygiene_sk,
    properties.isCounseling,
    properties.isCulture,
    properties.isDrugsAndSex,
    properties.isHygiene,
    properties.isMeals,
    properties.isMedicalTreatment,
    properties.isOvernight,
    properties.meals_en,
    properties.meals_sk,
    properties.medicalTreatment_en,
    properties.medicalTreatment_sk,
    properties.overnight_en,
    properties.overnight_sk,
  ]);

  return (
    <div>
      <div className="flex flex-col p-6">
        <div className={cx("flex flex-col space-y-4", className)}>
          <div className="font-semibold pt-1 pr-12">
            {language === "sk" ? properties.name_sk : properties.name_en}
          </div>

          {isSomeService && (
            <div className="flex flex-col gap-2">
              <div className="font-light text-[14px]">{detailT("services")}</div>
              <div className="flex flex-wrap gap-2">
                {properties.isCounseling && (
                  <Tag
                    style={{ background: colors.counseling }}
                    className="text-foreground-lightmode"
                  >
                    {layersT(`counseling`)}
                  </Tag>
                )}
                {properties.isHygiene && (
                  <Tag style={{ background: colors.hygiene }} className="text-foreground-lightmode">
                    {layersT(`hygiene`)}
                  </Tag>
                )}
                {properties.isOvernight && (
                  <Tag style={{ background: colors.overnight }} className="text-white">
                    {layersT(`overnight`)}
                  </Tag>
                )}
                {properties.isMeals && (
                  <Tag style={{ background: colors.meals }} className="text-foreground-lightmode">
                    {layersT(`meals`)}
                  </Tag>
                )}
                {properties.isMedicalTreatment && (
                  <Tag
                    style={{ background: colors.medicalTreatment }}
                    className="text-foreground-lightmode"
                  >
                    {layersT(`medicalTreatment`)}
                  </Tag>
                )}
                {properties.isCulture && (
                  <Tag style={{ background: colors.culture }} className="text-white">
                    {layersT(`culture`)}
                  </Tag>
                )}
                {properties.isDrugsAndSex && (
                  <Tag style={{ background: colors.drugsAndSex }} className="text-white">
                    {layersT(`drugsAndSex`)}
                  </Tag>
                )}
              </div>
            </div>
          )}

          <DataDisplay
            label={detailT("address")}
            text={language === "sk" ? properties.address_sk : properties.address_en}
          />
          <DataDisplay
            label={detailT("route")}
            text={language === "sk" ? properties.howToGetThere_sk : properties.howToGetThere_en}
          />

          {properties.navigate && (
            <a
              className="underline font-semibold"
              href={properties.navigate}
              target="_blank"
              rel="noreferrer"
            >
              {detailT("navigate")}
            </a>
          )}

          <DataDisplay enableEnhancements label={detailT("email")} text={properties.email} />

          <DataDisplay enableEnhancements label={detailT("phone")} text={properties.phone} />

          <DetailWebRow href={properties.web} label={detailT("web")} />

          <DataDisplay
            label={detailT("provider")}
            text={language === "sk" ? properties.provider_sk : properties.provider_en}
          />

          {isSomeService && (
            <>
              <Divider />

              {isMobile ? (
                moreInformation
              ) : (
                <Accordion collapsible type="single">
                  <AccordionItem
                    headerIsTrigger
                    value="value"
                    title={<div className="font-semibold">{mainT("moreInformation")}</div>}
                  >
                    <div className="flex flex-col gap-4">{moreInformation}</div>
                  </AccordionItem>
                </Accordion>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
