import { DataDisplay, Tag } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { useTranslation } from "react-i18next";
import { colors } from "../../utils/colors";
import cx from "classnames";
import { ButtonLink } from "../ButtonLink";

export interface IDetailDataDisplayProps {
  feature: Feature;
  className?: string;
}

export const DetailDataDisplay = ({ feature, className }: IDetailDataDisplayProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail" });

  const occupancy = feature?.properties?.occupancy as "forRent" | "occupied" | "free";
  const contractLink: string = feature.properties?.ORIGINAL_NZ_link || '';

  return (
    <div className={cx("relative flex flex-col space-y-4 p-6", className)}>
      {feature.properties?.competition && occupancy === "forRent" && (
        <div className="absolute -translate-y-12">
          <ButtonLink color={colors.forRent} href={feature.properties?.competition}>
            {t("ongoingCompetition")}
          </ButtonLink>
        </div>
      )}

      <Tag
        className="w-fit text-white"
        style={{
          background: colors[occupancy],
        }}
      >
        {t(occupancy)}
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
      {contractLink &&
        <DataDisplay
          label={t(`contract`)}
          text={
              <a
                className="font-bold flex underline"
                rel="noreferrer"
                href={contractLink}
                target="_blank"
              >
                {t("rentalContract")}
              </a>
          }
        />
      }
    </div>
  );
};
