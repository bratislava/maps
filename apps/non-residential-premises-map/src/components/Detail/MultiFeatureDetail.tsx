import { X } from "@bratislava/react-maps-icons";
import { Accordion, AccordionItem, IconButton } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { useEffect, useMemo, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { DetailDataDisplay } from "./DetailDataDisplay";
import cx from "classnames";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";

export interface IMultiFeatureDetailProps {
  features: Feature[];
  onClose: () => void;
}

export const MultiFeatureDetail = ({ features, onClose }: IMultiFeatureDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail" });

  const featureCount = useMemo(() => features.length, [features]);
  const locality = useMemo(() => features[0]?.properties?.locality, [features]);

  const [openedValue, setOpenedValue] = useState("0-0");

  useEffect(() => {
    setOpenedValue("0-0");
  }, [features]);

  const uniquePurposes = useMemo(() => {
    return getUniqueValuesFromFeatures(features, "purpose");
  }, [features]);

  const clusteredFeatures = useMemo(() => {
    return [
      ...uniquePurposes.map((purpose) => ({
        title: purpose,
        features: features.filter((f) => f.properties?.purpose === purpose),
      })),
    ];
  }, [features, uniquePurposes]);

  return (
    <div className="flex flex-col max-h-screen gap-5 overflow-auto pb-2">
      <IconButton
        className="hidden absolute right-3 top-5 md:flex items-center justify-center !shadow-none !border-none"
        onClick={onClose}
      >
        <X />
      </IconButton>

      <div className="font-semibold px-6 pt-8">
        <span>{locality}</span>{" "}
        <span className="opacity-50">({t("premiseCount", { count: featureCount })})</span>
      </div>

      <Accordion collapsible value={openedValue} onValueChange={setOpenedValue} type="single">
        {clusteredFeatures.map((cluster, i) => (
          <Fragment key={i}>
            <div className="bg-gray-lightmode/10 dark:bg-gray-darkmode/20 px-6 py-3 flex justify-between items-center">
              <span className="first-letter:uppercase">{cluster.title}</span>
              <span className="opacity-50">
                ({t("premiseCount", { count: cluster.features.length })})
              </span>
            </div>
            {cluster.features.map((feature, j) => (
              <AccordionItem
                headerIsTrigger
                key={j}
                value={`${i}-${j}`}
                title={<div className="font-semibold pl-6">{feature.properties?.lessee}</div>}
                headerClassName={cx("text-left border-l-[4px]", {
                  "border-[#E46054]": feature.properties?.occupancy === "occupied",
                  "border-[#0F6D95]": feature.properties?.occupancy === "free",
                })}
              >
                <div
                  className={cx("border-l-[4px]", {
                    "border-[#E46054]": feature.properties?.occupancy === "occupied",
                    "border-[#0F6D95]": feature.properties?.occupancy === "free",
                  })}
                >
                  <DetailDataDisplay feature={feature} />
                </div>
              </AccordionItem>
            ))}
          </Fragment>
        ))}
      </Accordion>
    </div>
  );
};
