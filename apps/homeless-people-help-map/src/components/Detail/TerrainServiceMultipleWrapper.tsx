import { Accordion, AccordionItem, Divider, Feedback } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import { z } from "zod";
import { Fragment, useState } from "react";
import { TerrainServiceDetail } from "./TerrainServiceDetail";

export const terrainServicePropertiesSchema = z.object({
  key: z.string(),
  title: z.string().optional(),
  provider: z.string().optional(),
  phone: z.number().optional().nullable(),
  // web: z.string(),
  // openingHours: z.string(),
  price: z.string().optional(),
  areas: z.string().optional(),
});

export const nameSchema = z.string().optional();

export const TerrainServicesDetailPropertiesSchema = z.object({
  terrainServices: terrainServicePropertiesSchema.array(),
  name: nameSchema,
});

type TerrainServicesDetailsProperties = z.infer<typeof TerrainServicesDetailPropertiesSchema>;

export interface ITerrainServiceWrapperProps extends TerrainServicesDetailsProperties {
  isMobile: boolean;
}

export const TerrainServiceWrapper = ({
  terrainServices,
  name,
  isMobile,
}: ITerrainServiceWrapperProps) => {
  const { t } = useTranslation();
  const [openedValue, setOpenedValue] = useState(isMobile ? undefined : "0");

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col gap-y-3">
        <div className="font-semibold pt-1 pr-12">{name}</div>
        <Accordion
          className="-mx-4"
          collapsible
          value={openedValue}
          onValueChange={setOpenedValue}
          type="single"
        >
          {terrainServices.map((terrainService, index) => {
            const { key, title, provider, phone, price, areas } = terrainService;
            return (
              <Fragment key={key}>
                <AccordionItem
                  headerIsTrigger
                  value={index.toString()}
                  title={<div className="font-semibold">{title}</div>}
                  headerClassName={
                    "px-4 py-3 text-left bg-primary-soft dark:bg-primary-soft-darkmode border-b-2 border-primary dark:border-primary-darkmode mb-0"
                  }
                >
                  <div className="px-4 py-3">
                    <div className="flex flex-col gap-4">
                      <TerrainServiceDetail
                        provider={provider}
                        phone={phone?.toString()}
                        price={price}
                        areas={areas}
                      />
                    </div>
                  </div>
                </AccordionItem>
              </Fragment>
            );
          })}
        </Accordion>
        <Feedback
          problemHint={t("problemHint")}
          reportProblemLink={t("reportProblemLink")}
          reportProblem={t("reportProblem")}
        />
      </div>
    </div>
  );
};
