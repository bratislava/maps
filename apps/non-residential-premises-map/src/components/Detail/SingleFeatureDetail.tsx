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

  const alternativeImage = !feature?.properties?.picture && feature?.properties?.occupancy === "forRent" ? "placeholder.png" : "";
  const image = feature?.properties?.picture || alternativeImage;
  return (
    <div className="flex flex-col">
      {image &&
        (<AnimateHeight isVisible={isExpanded}>
          <button className="w-full" onClick={() => setModalOpen(true)}>
            <Image object="cover" src={image} />
          </button>
        </AnimateHeight>)
      }

      {
        feature?.properties?.picture && (
          <ImageLightBox
            onClose={() => setModalOpen(false)}
            isOpen={isModalOpen}
            images={[feature?.properties?.picture]}
            initialImageIndex={0}
          />
        )
      }

      {
        !isExpanded && (
          <div className="py-4 px-6">
            <DataDisplay label={t("lessee")} text={feature.properties?.lessee} />
          </div>
        )
      }
      {isExpanded && <DetailDataDisplay isSingleFeature={true} feature={feature} />}
    </div >
  );
};
