/* eslint-disable camelcase */
import { DataDisplay, Tag } from "@bratislava/react-maps-ui";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import DetailWebRow from "./DetailWebRow";

export const otherServiceFeaturePropertiesSchema = z.object({
  name: z.string(),
  tag: z.string(),
  provider: z.string(),
  service: z.string(),
  phone: z.string(),
  time: z.string(),
  price: z.string(),
  howToGetThere: z.string(),
  web: z.string(),
  locality: z.string(),
  address: z.string(),
  description: z.string(),
  isDrugsAndSex: z.boolean().optional(),
  isKolo: z.boolean().optional(),
});

type OtherServiceProperties = z.infer<typeof otherServiceFeaturePropertiesSchema>;

export const OtherServiceDetail = ({
  name,
  tag,
  provider,
  service,
  phone,
  time,
  price,
  howToGetThere,
  web,
  locality,
  address,
  description,
  isDrugsAndSex,
  isKolo,
}: OtherServiceProperties) => {
  const { t } = useTranslation();
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="font-semibold pt-1 pr-12">{name}</div>
      <Tag
        className={cx("text-white w-fit lowercase", {
          "bg-[#EFB646]": isKolo,
          "bg-[#9E2D35]": isDrugsAndSex,
        })}
      >
        {tag}
      </Tag>
      <DataDisplay label={t("detail.otherService.locality")} text={locality} />
      <DataDisplay label={t("detail.otherService.address")} text={address} />
      <DataDisplay label={t("detail.otherService.service")} text={service} />
      <DataDisplay label={t("detail.otherService.how")} text={howToGetThere} />
      <DataDisplay label={t("detail.otherService.time")} text={time} />
      <DataDisplay label={t("detail.otherService.price")} text={price} />
      <DataDisplay enableEnhancements label={t("detail.otherService.phone")} text={phone} />
      <DataDisplay label={t("detail.otherService.description")} text={description} />
      <DetailWebRow href={web} label={t("detail.otherService.web")} />
      <DataDisplay label={t("detail.otherService.provider")} text={provider} />
    </div>
  );
};
