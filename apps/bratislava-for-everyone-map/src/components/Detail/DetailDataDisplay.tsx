import { DataDisplay, Divider, Tag } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import { colors } from "../../utils/colors";
import { useMemo } from "react";

export interface IDetailDataDisplayProps {
  feature: Feature;
  className?: string;
}

export const DetailDataDisplay = ({ feature, className }: IDetailDataDisplayProps) => {
  const { t: detailT } = useTranslation("translation", { keyPrefix: "detail" });
  const { t: layersT } = useTranslation("translation", { keyPrefix: "layers" });

  const isSomeService = useMemo(() => {
    return !!(
      feature?.properties?.counselin ||
      feature?.properties?.hygiene ||
      feature?.properties?.overnight ||
      feature?.properties?.meals ||
      feature?.properties?.medicalTreatment ||
      feature?.properties?.culture
    );
  }, [feature.properties]);

  return (
    <div className={cx("flex flex-col space-y-4 p-6", className)}>
      <div className="font-semibold pt-1">{feature?.properties?.name}</div>

      {isSomeService && (
        <div className="flex flex-col gap-2">
          <div className="font-light text-[14px]">{detailT("services")}</div>
          <div className="flex flex-wrap gap-2">
            {feature?.properties?.counseling && (
              <Tag style={{ background: colors.counseling }} className="text-foreground-lightmode">
                {layersT(`counseling`)}
              </Tag>
            )}
            {feature?.properties?.hygiene && (
              <Tag style={{ background: colors.hygiene }} className="text-foreground-lightmode">
                {layersT(`hygiene`)}
              </Tag>
            )}
            {feature?.properties?.overnight && (
              <Tag style={{ background: colors.overnight }} className="text-white">
                {layersT(`overnight`)}
              </Tag>
            )}
            {feature?.properties?.meals && (
              <Tag style={{ background: colors.meals }} className="text-foreground-lightmode">
                {layersT(`meals`)}
              </Tag>
            )}
            {feature?.properties?.medicalTreatment && (
              <Tag
                style={{ background: colors.medicalTreatment }}
                className="text-foreground-lightmode"
              >
                {layersT(`medicalTreatment`)}
              </Tag>
            )}
            {feature?.properties?.culture && (
              <Tag style={{ background: colors.culture }} className="text-white">
                {layersT(`culture`)}
              </Tag>
            )}
          </div>
        </div>
      )}

      <DataDisplay label={detailT("address")} text={feature?.properties?.address} />
      <DataDisplay label={detailT("route")} text={feature?.properties?.route} />

      {feature.properties?.navigate && (
        <a
          className="underline font-semibold"
          href={feature.properties.navigate}
          target="_blank"
          rel="noreferrer"
        >
          {detailT("navigate")}
        </a>
      )}

      {feature.properties?.email && (
        <DataDisplay
          label={detailT("email")}
          text={
            <a
              className="underline font-semibold"
              href={`mailto:${feature.properties.email}`}
              target="_blank"
              rel="noreferrer"
            >
              {feature.properties.email}
            </a>
          }
        />
      )}

      {feature.properties?.phone && (
        <DataDisplay
          label={detailT("phone")}
          text={
            <a
              className="underline font-semibold"
              href={`tel:${feature.properties.phone}`}
              target="_blank"
              rel="noreferrer"
            >
              {feature.properties.phone}
            </a>
          }
        />
      )}
      {feature.properties?.web && (
        <DataDisplay
          label={detailT("web")}
          text={
            <a
              className="underline font-semibold"
              href={feature.properties.web}
              target="_blank"
              rel="noreferrer"
            >
              {feature.properties.web}
            </a>
          }
        />
      )}

      <DataDisplay label={detailT("provider")} text={feature?.properties?.provider} />
      {isSomeService && (
        <>
          <Divider />

          {feature?.properties?.counseling && (
            <DataDisplay
              label={<div className="first-letter:uppercase">{layersT(`counseling`)}</div>}
              text={feature?.properties?.counseling}
            />
          )}
          {feature?.properties?.hygiene && (
            <DataDisplay
              label={<div className="first-letter:uppercase">{layersT(`hygiene`)}</div>}
              text={feature?.properties?.hygiene}
            />
          )}
          {feature?.properties?.overnight && (
            <DataDisplay
              label={<div className="first-letter:uppercase">{layersT(`overnight`)}</div>}
              text={feature?.properties?.overnight}
            />
          )}
          {feature?.properties?.meals && (
            <DataDisplay
              label={<div className="first-letter:uppercase">{layersT(`meals`)}</div>}
              text={feature?.properties?.meals}
            />
          )}
          {feature?.properties?.medicalTreatment && (
            <DataDisplay
              label={<div className="first-letter:uppercase">{layersT(`medicalTreatment`)}</div>}
              text={feature?.properties?.medicalTreatment}
            />
          )}
          {feature?.properties?.culture && (
            <DataDisplay
              label={<div className="first-letter:uppercase">{layersT(`culture`)}</div>}
              text={feature?.properties?.culture}
            />
          )}
        </>
      )}
    </div>
  );
};
