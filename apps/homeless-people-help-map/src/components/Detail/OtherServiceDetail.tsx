/* eslint-disable camelcase */
import { z } from "zod";
import { DataDisplay, Tag } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import cx from "classnames";

export const otherServiceFeaturePropertiesSchema = z.object({
  name_sk: z.string(),
  name_en: z.string(),
  tag_sk: z.string(),
  tag_en: z.string(),
  provider_sk: z.string(),
  provider_en: z.string(),
  service_sk: z.string(),
  service_en: z.string(),
  phone: z.string(),
  time_sk: z.string(),
  time_en: z.string(),
  price_sk: z.string(),
  price_en: z.string(),
  howToGetThere_sk: z.string(),
  howToGetThere_en: z.string(),
  web: z.string(),
  locality_sk: z.string(),
  locality_en: z.string(),
  address_sk: z.string(),
  address_en: z.string(),
  description_sk: z.string(),
  description_en: z.string(),
  isNotaBene: z.boolean().optional(),
  isDrugsAndSex: z.boolean().optional(),
  isKolo: z.boolean().optional(),
});

type OtherServiceProperties = z.infer<typeof otherServiceFeaturePropertiesSchema>;

export const OtherServiceDetail = ({
  name_sk,
  name_en,
  tag_sk,
  tag_en,
  provider_sk,
  provider_en,
  service_sk,
  service_en,
  phone,
  time_sk,
  time_en,
  price_sk,
  price_en,
  howToGetThere_en,
  howToGetThere_sk,
  web,
  locality_sk,
  locality_en,
  address_sk,
  address_en,
  isNotaBene,
  description_en,
  description_sk,
  isDrugsAndSex,
  isKolo,
}: OtherServiceProperties) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="font-semibold pt-1 pr-12">{language === "sk" ? name_sk : name_en}</div>
      <Tag
        className={cx("text-white w-fit lowercase", {
          "bg-[#547242]": isNotaBene,
          "bg-[#EFB646]": isKolo,
          "bg-[#9E2D35]": isDrugsAndSex,
        })}
      >
        {language === "sk" ? tag_sk : tag_en}
      </Tag>
      <DataDisplay
        label={t("detail.otherService.locality")}
        text={language === "sk" ? locality_sk : locality_en}
      />
      <DataDisplay
        label={t("detail.otherService.address")}
        text={language === "sk" ? address_sk : address_en}
      />
      <DataDisplay
        label={t("detail.otherService.service")}
        text={language === "sk" ? service_sk : service_en}
      />
      <DataDisplay
        label={t("detail.otherService.how")}
        text={language === "sk" ? howToGetThere_sk : howToGetThere_en}
      />
      <DataDisplay
        label={t("detail.otherService.time")}
        text={language === "sk" ? time_sk : time_en}
      />
      <DataDisplay
        label={t("detail.otherService.price")}
        text={language === "sk" ? price_sk : price_en}
      />
      <DataDisplay enableEnhancements label={t("detail.otherService.phone")} text={phone} />
      <DataDisplay
        switchFontWeights
        label={t("detail.otherService.description")}
        text={language === "sk" ? description_sk : description_en}
      />
      <DataDisplay enableEnhancements label={t("detail.otherService.web")} text={web} />
      <DataDisplay
        label={t("detail.otherService.provider")}
        text={language === "sk" ? provider_sk : provider_en}
      />
    </div>
  );
};
