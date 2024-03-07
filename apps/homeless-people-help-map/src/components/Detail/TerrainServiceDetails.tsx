import { Accordion, AccordionItem, DataDisplay, Divider, Tag } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { colors } from "../../utils/colors";
import cx from "classnames";
import { z } from "zod";
import { Fragment, useState } from "react";

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
type TerrainServiceProperties = z.infer<typeof terrainServicePropertiesSchema>;

export const nameSchema = z.string().optional();

export const TerrainServicesDetailPropertiesSchema = z.object({
  terrainServices: terrainServicePropertiesSchema.array(),
  name: nameSchema,
});

type TerrainServicesDetailsProperties = z.infer<typeof TerrainServicesDetailPropertiesSchema>;

const DetailTerrainServiceItem = ({
  key,
  provider,
  phone,
  price,
  areas,
}: TerrainServiceProperties) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail.terrainService" });
  const { t: detailT } = useTranslation("translation", { keyPrefix: "detail.main" });

  return (
    <div key={key} className="flex flex-col gap-4">
      <div>
        <div className="font-light text-[14px] mt-3">{detailT("services")}</div>
        <Tag className="w-fit lowercase mt-1" style={{ background: colors.terrainServices }}>
          {t("tag")}
        </Tag>
      </div>
      <DataDisplay label={t("provider")} text={provider} />
      <DataDisplay enableEnhancements label={t("phone")} text={phone} />
      {/* <DetailWebRow href={web} label={t("web")} />
      <DataDisplay label={t("openingHours")} text={openingHours} /> */}
      <DataDisplay label={t("price")} text={price} />
      <DataDisplay label={t("areas")} text={areas} />
    </div>
  );
};

// TODO fix missing web and openingHours,
export const TerrainServiceDetails = ({
  terrainServices,
  name,
}: TerrainServicesDetailsProperties) => {
  const [openedValue, setOpenedValue] = useState("0");

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
            const { key, title } = terrainService;
            return (
              <Fragment key={key}>
                <AccordionItem
                  headerIsTrigger
                  value={`${index}`}
                  title={<div className="font-semibold">{title}</div>}
                  headerClassName={
                    "px-4 py-3 text-left bg-primary-soft dark:bg-primary-soft-darkmode border-b-2 border-primary dark:border-primary-darkmode mb-0"
                  }
                >
                  <div
                    className={cx("px-4", {
                      "pb-3": index !== terrainServices.length - 1,
                    })}
                  >
                    <DetailTerrainServiceItem {...terrainService} />
                    {index > 0 && <Divider className="mx-6" />}
                  </div>
                </AccordionItem>
              </Fragment>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};
