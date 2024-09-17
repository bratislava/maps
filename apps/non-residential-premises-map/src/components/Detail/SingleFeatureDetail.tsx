import { useState } from "react";
import { AnimateHeight, DataDisplay, ImageLightBox, Image } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { DetailDataDisplay } from "./DetailDataDisplay";
import { useTranslation } from "react-i18next";
import { useArcgisAttachments } from "@bratislava/react-use-arcgis";
import { GEOPORTAL_LAYER_URL } from "../../utils/const";

export interface ISingleFeatureDetailProps {
  feature: Feature;
  isExpanded: boolean;
  isMobile?: boolean;
}

export const SingleFeatureDetail = ({
  feature,
  isExpanded,
  isMobile,
}: ISingleFeatureDetailProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("translation", { keyPrefix: "detail" });
  const { t: mainT } = useTranslation();

  const { data: featureAttachments } = useArcgisAttachments(GEOPORTAL_LAYER_URL, feature?.id || 0);
  const featureImages = featureAttachments?.length
    ? featureAttachments.map(
        (attachment) => `${GEOPORTAL_LAYER_URL}/${feature?.id}/attachments/${attachment.id}`,
      )
    : undefined;
  const alternativeImage =
    !featureImages && !feature?.properties?.picture && feature?.properties?.occupancy === "forRent"
      ? "placeholder.png"
      : "";
  const firstFeatureImage = featureImages ? featureImages[0] : undefined;
  const image = feature?.properties?.picture || firstFeatureImage || alternativeImage;
  const images = featureImages || [image];

  return (
    <div className="flex flex-col">
      {image && (
        <AnimateHeight isVisible={isExpanded}>
          {alternativeImage ? (
            <div className="w-full">
              <Image src={image} isMobile={isMobile} imageMissingText={mainT("loadingImage")} />
            </div>
          ) : (
            <button className="w-full" onClick={() => setModalOpen(true)}>
              <Image src={image} isMobile={isMobile} imageMissingText={mainT("loadingImage")} />
            </button>
          )}
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
          <DataDisplay label={t("locality")} text={feature.properties?.locality} />
        </div>
      )}
      {isExpanded && <DetailDataDisplay isSingleFeature={true} feature={feature} />}
    </div>
  );
};
