import { useState } from "react";
import { X } from "@bratislava/react-maps-icons";
import { IconButton, ImageLightBox } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { Image } from "../Image";
import { DetailDataDisplay } from "./DetailDataDisplay";
import cx from "classnames";

export interface ISingleFeatureDetailProps {
  feature: Feature;
  onClose: () => void;
}

export const SingleFeatureDetail = ({ feature, onClose }: ISingleFeatureDetailProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col max-h-screen overflow-auto">
      <button onClick={() => setModalOpen(true)}>
        {feature?.properties?.picture && (
          <Image object="cover" src={feature?.properties?.picture} />
        )}
      </button>

      <ImageLightBox
        onClose={() => setModalOpen(false)}
        isOpen={isModalOpen}
        images={[
          feature?.properties?.picture,
          feature?.properties?.picture,
          feature?.properties?.picture,
        ]}
        initialImageIndex={0}
      />

      <IconButton
        className={cx(
          "hidden w-8 h-8 rounded-full absolute right-6 top-6 md:flex items-center justify-center",
          { "!shadow-none": !feature?.properties?.picture },
        )}
        onClick={onClose}
      >
        <X size="sm" />
      </IconButton>

      <DetailDataDisplay feature={feature} />
    </div>
  );
};
