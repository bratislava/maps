import { Accordion, AccordionItem, Divider } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { useEffect, useMemo, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { DetailDataDisplay } from "./DetailDataDisplay";
import cx from "classnames";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";

const CustomAccordionItem = ({
  value,
  feature,
  isLastFromCluster,
}: {
  key: number;
  value: string;
  feature: Feature;
  isLastFromCluster: boolean;
}) => {
  return (
    <AccordionItem
      headerIsTrigger
      value={value}
      title={<div className="font-semibold pl-6">{feature.properties?.lessee}</div>}
      headerClassName={cx("text-left border-l-[4px]", {
        "border-[#F1B830]": feature.properties?.occupancy === "forRent",
        "border-[#D83728]": feature.properties?.occupancy === "occupied",
        "border-[#985403]": feature.properties?.occupancy === "other",
        "border-[#005F88]": feature.properties?.occupancy === "free",
      })}
    >
      <div
        className={cx("border-l-[4px]", {
          "border-[#F1B830]": feature.properties?.occupancy === "forRent",
          "border-[#D83728]": feature.properties?.occupancy === "occupied",
          "border-[#985403]": feature.properties?.occupancy === "other",
          "border-[#005F88]": feature.properties?.occupancy === "free",
          "pb-3": isLastFromCluster,
        })}
      >
        <DetailDataDisplay className="!pt-2" feature={feature} />
      </div>
    </AccordionItem>
  );
};

export interface IMultiFeatureDetailProps {
  features: Feature[];
}

export const MultiFeatureDetail = ({ features }: IMultiFeatureDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail" });

  const featureCount = useMemo(() => features.length, [features]);
  const locality = useMemo(() => features[0]?.properties?.locality, [features]);

  const [openedValue, setOpenedValue] = useState("0-0");

  useEffect(() => {
    setOpenedValue("0-0");
  }, [features]);

  const uniquePurposes = useMemo(() => {
    return getUniqueValuesFromFeatures(features, "purpose")
      .sort()
      .filter((p) => p !== "iné")
      .concat(["iné"]);
  }, [features]);

  const clusteredFeatures = useMemo(() => {
    return [
      ...uniquePurposes
        .map((purpose) => ({
          title: purpose,
          features: features.filter((f) => f.properties?.purpose === purpose),
        }))
        .filter((p) => p.features.length),
    ];
  }, [features, uniquePurposes]);

  return (
    <div className="flex flex-col gap-5 pb-2">
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
              <>
                {j > 0 && <Divider className="mx-6" />}
                <CustomAccordionItem
                  key={j}
                  feature={feature}
                  value={`${i}-${j}`}
                  isLastFromCluster={j !== cluster.features.length - 1}
                />
              </>
            ))}
          </Fragment>
        ))}
      </Accordion>
    </div>
  );
};
