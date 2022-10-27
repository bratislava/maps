import { X } from "@bratislava/react-maps-icons";
import { Accordion, AccordionItem, IconButton } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DetailDataDisplay } from "./DetailDataDisplay";

export interface IMultiFeatureDetailProps {
  features: Feature[];
  onClose: () => void;
}

export const MultiFeatureDetail = ({ features, onClose }: IMultiFeatureDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail" });

  const featureCount = useMemo(() => features.length, [features]);
  const locality = useMemo(() => features[0]?.properties?.locality, [features]);

  const [openedValue, setOpenedValue] = useState("0");

  useEffect(() => {
    setOpenedValue("0");
  }, [features]);

  return (
    <div className="flex flex-col max-h-screen gap-5 overflow-auto">
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
        {features.map((feature, index) => (
          <AccordionItem
            headerIsTrigger
            key={index}
            value={`${index}`}
            title={<div className="font-semibold pl-6">{feature.properties?.lessee}</div>}
            headerClassName="bg-gray-lightmode/10 dark:bg-gray-darkmode/10"
          >
            <DetailDataDisplay feature={feature} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
