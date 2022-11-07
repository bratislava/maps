import { DataDisplay, Tag } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { useTranslation } from "react-i18next";
import colors from "../../utils/colors.json";
import cx from "classnames";

export interface IDetailDataDisplayProps {
  feature: Feature;
  className?: string;
}

export const DetailDataDisplay = ({ feature, className }: IDetailDataDisplayProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail" });
  return (
    <div className={cx("flex flex-col space-y-4 p-6", className)}>
      <Tag
        className="w-fit text-white"
        style={{
          background: feature?.properties?.occupancy === "free" ? colors.free : colors.occupied,
        }}
      >
        {feature?.properties?.occupancy === "free" ? t("free") : t("occupied")}
      </Tag>

      <DataDisplay label={t(`locality`)} text={feature?.properties?.locality} />
      <DataDisplay label={t(`purpose`)} text={feature?.properties?.purpose} />
      <DataDisplay label={t(`lessee`)} text={feature?.properties?.lessee} />
      <DataDisplay label={t(`rentUntil`)} text={feature?.properties?.rentUntil} />
      <DataDisplay label={t(`description`)} text={feature?.properties?.description} />
      <DataDisplay
        label={t(`approximateArea`)}
        text={
          typeof feature?.properties?.approximateArea === "number" && (
            <span>
              {feature?.properties?.approximateArea.toFixed(2).replace(".", ",")} m
              <sup className="text-xs font-bold">2</sup>
            </span>
          )
        }
      />
      <DataDisplay
        label={t(`approximateRentPricePerYear`)}
        text={
          typeof feature?.properties?.approximateRentPricePerYear === "number" && (
            <span>
              {(Math.round(feature?.properties?.approximateRentPricePerYear / 10) * 10)
                .toFixed(2)
                .replace(".", ",")}{" "}
              €
            </span>
          )
        }
      />
    </div>
  );
};
