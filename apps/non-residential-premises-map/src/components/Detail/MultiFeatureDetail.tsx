import { X } from "@bratislava/react-maps-icons";
import {
  Accordion,
  AccordionItem,
  Divider,
  IconButton,
  ImageLightBox,
} from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { useEffect, useMemo, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { DetailDataDisplay } from "./DetailDataDisplay";
import cx from "classnames";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { Image } from "../Image";
import { t } from "i18next";

const CustomAccordionItem = ({
  key,
  value,
  feature,
  isLastFromCluster,
}: {
  key: number;
  value: string;
  feature: Feature;
  isLastFromCluster: boolean;
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("translation", { keyPrefix: "detail" });
  return (
    <AccordionItem
      headerIsTrigger
      key={key}
      value={value}
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
          "pb-3": isLastFromCluster,
        })}
      >
        {feature?.properties?.picture && (
          <>
            <button
              className="flex items-center mx-6 gap-2 font-semibold underline py-2"
              onClick={() => setModalOpen(true)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 16V2C18 0.895 17.105 0 16 0H2C0.895 0 0 0.895 0 2V16C0 17.105 0.895 18 2 18H16C17.105 18 18 17.105 18 16ZM5.5 10.5L8 13.505L11.5 9L16 15H2L5.5 10.5Z"
                  fill="black"
                />
              </svg>
              <span>{t("premisePhotos")}</span>
            </button>
            <ImageLightBox
              onClose={() => setModalOpen(false)}
              isOpen={isModalOpen}
              images={[feature?.properties?.picture]}
              initialImageIndex={0}
            />
          </>
        )}

        <DetailDataDisplay className="!pt-2" feature={feature} />
        {isLastFromCluster && <Divider className="mx-6" />}
      </div>
    </AccordionItem>
  );
};

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
    <div className="flex flex-col max-h-screen gap-5 overflow-auto pb-2">
      <IconButton
        className="hidden !bg-[transparent] absolute right-3 top-5 md:flex items-center justify-center !shadow-none !border-none"
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
              <CustomAccordionItem
                key={j}
                feature={feature}
                value={`${i}-${j}`}
                isLastFromCluster={j !== cluster.features.length - 1}
              />
            ))}
          </Fragment>
        ))}
      </Accordion>
    </div>
  );
};
