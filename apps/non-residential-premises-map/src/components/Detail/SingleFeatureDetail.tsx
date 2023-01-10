import { useState } from "react";
import { AnimateHeight, DataDisplay, ImageLightBox } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { Image } from "../Image";
import { DetailDataDisplay } from "./DetailDataDisplay";
import { useTranslation } from "react-i18next";

export interface ISingleFeatureDetailProps {
  feature: Feature;
  isExpanded: boolean;
}

export const SingleFeatureDetail = ({ feature, isExpanded }: ISingleFeatureDetailProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("translation", { keyPrefix: "detail" });

  return (
    <div className="flex flex-col">
      <AnimateHeight isVisible={isExpanded && feature.properties?.occupancy === "forRent"}>
        <button className="w-full" onClick={() => setModalOpen(true)}>
          <Image object="cover" src={feature?.properties?.picture ?? "placeholder.png"} />
        </button>
      </AnimateHeight>
      {feature?.properties?.picture && (
        <ImageLightBox
          onClose={() => setModalOpen(false)}
          isOpen={isModalOpen}
          images={[feature?.properties?.picture ?? "placeholder.png"]}
          initialImageIndex={0}
        />
      )}

      {!isExpanded && (
        <div className="py-4 px-6">
          <DataDisplay label={t("lessee")} text={feature.properties?.lessee} />
        </div>
      )}
      {isExpanded && <DetailDataDisplay feature={feature} />}
    </div>
  );
};
