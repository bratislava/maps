import { AnimateHeight, DataDisplay, Divider, Tag } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import { colors } from "../../utils/colors";
import { useMemo } from "react";
import { z } from "zod";
import { motion } from "framer-motion";

export const mainFeaturePropertiesSchema = z.object({
  layerId: z.number(),
  layerName: z.string(),
  counseling: z.string(),
  hygiene: z.string(),
  overnight: z.string(),
  meals: z.string(),
  medicalTreatment: z.string(),
  culture: z.string(),
  isCounseling: z.boolean(),
  isHygiene: z.boolean(),
  isOvernight: z.boolean(),
  isMeals: z.boolean(),
  isMedicalTreatment: z.boolean(),
  isCulture: z.boolean(),
  name: z.string(),
  provider: z.string(),
  address: z.string(),
  route: z.string(),
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
}

export const MainDetail = ({ properties, className, isExpanded }: IMainDetailProps) => {
  const { t: detailT } = useTranslation("translation", { keyPrefix: "detail.main" });
  const { t: layersT } = useTranslation("translation", { keyPrefix: "layers" });

  const isSomeService = useMemo(() => {
    return !!(
      properties.counseling ||
      properties.hygiene ||
      properties.overnight ||
      properties.meals ||
      properties.medicalTreatment ||
      properties.culture
    );
  }, [properties]);

  return (
    <div>
      <motion.div layout className="flex flex-col p-6">
        <AnimateHeight isVisible={!isExpanded}>
          <DataDisplay label={detailT("name")} text={properties.name} />
        </AnimateHeight>

        <AnimateHeight isVisible={isExpanded}>
          <div className={cx("flex flex-col space-y-4", className)}>
            <div className="font-semibold pt-1 pr-12">{properties.name}</div>

            {isSomeService && (
              <div className="flex flex-col gap-2">
                <div className="font-light text-[14px]">{detailT("services")}</div>
                <div className="flex flex-wrap gap-2">
                  {properties.counseling && (
                    <Tag
                      style={{ background: colors.counseling }}
                      className="text-foreground-lightmode"
                    >
                      {layersT(`counseling`)}
                    </Tag>
                  )}
                  {properties.hygiene && (
                    <Tag
                      style={{ background: colors.hygiene }}
                      className="text-foreground-lightmode"
                    >
                      {layersT(`hygiene`)}
                    </Tag>
                  )}
                  {properties.overnight && (
                    <Tag style={{ background: colors.overnight }} className="text-white">
                      {layersT(`overnight`)}
                    </Tag>
                  )}
                  {properties.meals && (
                    <Tag style={{ background: colors.meals }} className="text-foreground-lightmode">
                      {layersT(`meals`)}
                    </Tag>
                  )}
                  {properties.medicalTreatment && (
                    <Tag
                      style={{ background: colors.medicalTreatment }}
                      className="text-foreground-lightmode"
                    >
                      {layersT(`medicalTreatment`)}
                    </Tag>
                  )}
                  {properties.culture && (
                    <Tag style={{ background: colors.culture }} className="text-white">
                      {layersT(`culture`)}
                    </Tag>
                  )}
                </div>
              </div>
            )}

            <DataDisplay label={detailT("address")} text={properties.address} />
            <DataDisplay label={detailT("route")} text={properties.route} />

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

            {properties.email && (
              <DataDisplay
                label={detailT("email")}
                text={
                  <a
                    className="underline font-semibold"
                    href={`mailto:${properties.email}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {properties.email}
                  </a>
                }
              />
            )}

            {properties.phone && (
              <DataDisplay
                label={detailT("phone")}
                text={
                  <a
                    className="underline font-semibold"
                    href={`tel:${properties.phone}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {properties.phone}
                  </a>
                }
              />
            )}

            {properties.web && (
              <DataDisplay
                label={detailT("web")}
                text={
                  <a
                    className="underline font-semibold"
                    href={properties.web}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {properties.web}
                  </a>
                }
              />
            )}

            <DataDisplay label={detailT("provider")} text={properties.provider} />

            {isSomeService && (
              <>
                <Divider />

                {properties.counseling && (
                  <DataDisplay
                    label={<div className="first-letter:uppercase">{layersT(`counseling`)}</div>}
                    text={properties.counseling}
                  />
                )}
                {properties.hygiene && (
                  <DataDisplay
                    label={<div className="first-letter:uppercase">{layersT(`hygiene`)}</div>}
                    text={properties.hygiene}
                  />
                )}
                {properties.overnight && (
                  <DataDisplay
                    label={<div className="first-letter:uppercase">{layersT(`overnight`)}</div>}
                    text={properties.overnight}
                  />
                )}
                {properties.meals && (
                  <DataDisplay
                    label={<div className="first-letter:uppercase">{layersT(`meals`)}</div>}
                    text={properties.meals}
                  />
                )}
                {properties.medicalTreatment && (
                  <DataDisplay
                    label={
                      <div className="first-letter:uppercase">{layersT(`medicalTreatment`)}</div>
                    }
                    text={properties.medicalTreatment}
                  />
                )}
                {properties.culture && (
                  <DataDisplay
                    label={<div className="first-letter:uppercase">{layersT(`culture`)}</div>}
                    text={properties.culture}
                  />
                )}
              </>
            )}
          </div>
        </AnimateHeight>
      </motion.div>
    </div>
  );
};
