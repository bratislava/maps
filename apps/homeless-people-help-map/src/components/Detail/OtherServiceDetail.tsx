import { z } from "zod";
import { DataDisplay, Tag } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import { colors } from "../../utils/colors";

export const otherServiceFeaturePropertiesSchema = z.object({
  name: z.string(),
  tag: z.string(),
  provider: z.string(),
  service: z.string(),
  phone: z.string(),
  time: z.string(),
  price: z.string(),
  how: z.string(),
  web: z.string(),
  locality: z.string(),
  isNotaBene: z.boolean().optional(),
  isDrugsAndSex: z.boolean().optional(),
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
  how,
  web,
  locality,
  isNotaBene,
  isDrugsAndSex,
}: OtherServiceProperties) => {
  const { t } = useTranslation();
  return (
    <div className="p-6 flex flex-col gap-4">
      <DataDisplay label={t("detail.otherService.name")} text={name} />
      <Tag
        className={cx("text-white w-fit lowercase", {
          "bg-[#547242]": isNotaBene,
          "bg-[#9E2D35]": isDrugsAndSex,
        })}
      >
        {tag}
      </Tag>
      <DataDisplay label={t("detail.otherService.provider")} text={provider} />
      <DataDisplay label={t("detail.otherService.service")} text={service} />
      <DataDisplay label={t("detail.otherService.phone")} text={phone} />
      <DataDisplay label={t("detail.otherService.time")} text={time} />
      <DataDisplay label={t("detail.otherService.price")} text={price} />
      <DataDisplay label={t("detail.otherService.how")} text={how} />
      <DataDisplay label={t("detail.otherService.web")} text={web} />
      <DataDisplay label={t("detail.otherService.locality")} text={locality} />
    </div>
  );
};
