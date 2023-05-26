import { useState } from "react";
import { AnimateHeight, DataDisplay, ImageLightBox } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { Image } from "../Image";
import { DetailDataDisplay } from "./DetailDataDisplay";
import { useTranslation } from "react-i18next";
import useImageUrls from "../../hooks/useImageUrls";

export interface ISingleFeatureDetailProps {
  feature: Feature;
  isExpanded: boolean;
}

export const SingleFeatureDetail = ({ feature, isExpanded }: ISingleFeatureDetailProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("translation", { keyPrefix: "detail" });

  const imageUrlList = useImageUrls(feature.id, feature?.properties?.ORIGINAL_picture);

  return (
    <div className="flex flex-col">
      <AnimateHeight isVisible={isExpanded}>
        <button className="w-full" onClick={() => setModalOpen(true)}>
          <Image object="cover" src={imageUrlList && imageUrlList.length > 0 ? imageUrlList[0] : "placeholder.png"} />
        </button>
      </AnimateHeight>
      {feature?.properties?.picture && (
        <ImageLightBox
          onClose={() => setModalOpen(false)}
          isOpen={isModalOpen}
          images={imageUrlList || ["placeholder.png"]}
          initialImageIndex={0}
        />
      )}

      {!isExpanded && (
        <div className="py-4 px-6">
          <DataDisplay label={t("lessee")} text={feature.properties?.lessee} />
        </div>
      )}
      {isExpanded && <DetailDataDisplay isSingleFeature={true} feature={feature} />}
    </div>
  );
};
