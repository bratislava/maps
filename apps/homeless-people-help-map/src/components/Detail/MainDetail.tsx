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
  counseling: z.string(),
  hygiene: z.string(),
  overnight: z.string(),
  drugsAndSex: z.string(),
  meals: z.string(),
  medicalTreatment: z.string(),
  culture: z.string(),
  isCounseling: z.boolean(),
  isHygiene: z.boolean(),
  isOvernight: z.boolean(),
  isDrugsAndSex: z.boolean(),
  isMeals: z.boolean(),
  isMedicalTreatment: z.boolean(),
  isCulture: z.boolean(),
  name: z.string(),
  provider: z.string(),
  address: z.string(),
  howToGetThere: z.string(),
  phone: z.string(),
  email: z.string(),
  web: z.string(),
  navigate: z.string(),
  description: z.string(),
});

type MainProperties = z.infer<typeof mainFeaturePropertiesSchema>;

export interface IMainDetailProps {
  properties: MainProperties;
  className?: string;
  isExpanded: boolean;
  isMobile: boolean;
}

export const MainDetail = ({ properties, className, isExpanded, isMobile }: IMainDetailProps) => {
  const { t: detailT } = useTranslation("translation", { keyPrefix: "detail.main" });
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
            text={properties.counseling}
          />
        )}
        {properties.isHygiene && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`hygiene`)}</div>}
            text={properties.hygiene}
          />
        )}
        {properties.isOvernight && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`overnight`)}</div>}
            text={properties.overnight}
          />
        )}
        {properties.isMeals && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`meals`)}</div>}
            text={properties.meals}
          />
        )}
        {properties.isMedicalTreatment && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`medicalTreatment`)}</div>}
            text={properties.medicalTreatment}
          />
        )}
        {properties.isCulture && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`culture`)}</div>}
            text={properties.culture}
          />
        )}
        {properties.isDrugsAndSex && (
          <DataDisplay
            switchFontWeights
            label={<div className="first-letter:uppercase">{layersT(`drugsAndSex`)}</div>}
            text={properties.drugsAndSex}
          />
        )}
      </>
    );
  }, [
    layersT,
    properties.counseling,
    properties.culture,
    properties.drugsAndSex,
    properties.hygiene,
    properties.isCounseling,
    properties.isCulture,
    properties.isDrugsAndSex,
    properties.isHygiene,
    properties.isMeals,
    properties.isMedicalTreatment,
    properties.isOvernight,
    properties.meals,
    properties.medicalTreatment,
    properties.overnight,
  ]);
  console.log(isSomeService);

  return (
    <div>
      <div className="flex flex-col p-6">
        <div className={cx("flex flex-col space-y-4", className)}>
          <div className="font-semibold pt-1 pr-12">{properties.name}</div>

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

          <DataDisplay label={detailT("address")} text={properties.address} />
          <DataDisplay label={detailT("route")} text={properties.howToGetThere} />
          <DataDisplay label={detailT("description")} text={properties.description} />

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

          <DataDisplay label={detailT("provider")} text={properties.provider} />

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
