import { useState } from "react";
import { AnimateHeight, DataDisplay, ImageLightBox } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { Image } from "../Image";
import { DetailDataDisplay } from "./DetailDataDisplay";
import { useTranslation } from "react-i18next";
import { useArcgisAttachments } from "@bratislava/react-use-arcgis";
import { GEOPORTAL_LAYER_URL } from "../../utils/const";

export interface ISingleFeatureDetailProps {
  feature: Feature;
  isExpanded: boolean;
}

export const SingleFeatureDetail = ({ feature, isExpanded }: ISingleFeatureDetailProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("translation", { keyPrefix: "detail" });

  const { data: featureAttachments } = useArcgisAttachments(GEOPORTAL_LAYER_URL, feature?.id || 0);

  const alternativeImage =
    !feature?.properties?.picture && feature?.properties?.occupancy === "forRent"
      ? "placeholder.png"
      : "";
  const image = feature?.properties?.picture || alternativeImage;

  const images = featureAttachments?.length
    ? featureAttachments.map(
        (attachment) => `${GEOPORTAL_LAYER_URL}/${feature?.id}/attachments/${attachment.id}`,
      )
    : [image];

  return (
    <div className="flex flex-col">
      {image && (
        <AnimateHeight isVisible={isExpanded}>
          <button className="w-full" onClick={() => setModalOpen(true)}>
            <Image object="cover" src={image} />
          </button>
        </AnimateHeight>
      )}

      {images[0] && (
        <ImageLightBox
          onClose={() => setModalOpen(false)}
          isOpen={isModalOpen}
          images={images}
          initialImageIndex={0}
        />
      )}

      {!isExpanded && (
        <div className="py-4 px-6">
          <DataDisplay label={t("locality")} text={feature.properties?.lessee} />
        </div>
      )}
      {isExpanded && <DetailDataDisplay isSingleFeature={true} feature={feature} />}
    </div>
  );
};

