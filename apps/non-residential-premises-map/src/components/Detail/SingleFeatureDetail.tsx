import { X } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { Image } from "../Image";
import { DetailDataDisplay } from "./DetailDataDisplay";

export interface ISingleFeatureDetailProps {
  feature: Feature;
  onClose: () => void;
}

export const SingleFeatureDetail = ({ feature, onClose }: ISingleFeatureDetailProps) => {
  return (
    <div className="flex flex-col max-h-screen overflow-auto">
      {feature?.properties?.picture && <Image src={feature?.properties?.picture} />}

      <IconButton
        className="hidden w-8 h-8 rounded-full absolute right-6 top-6 md:flex items-center justify-center"
        onClick={onClose}
      >
        <X size="sm" />
      </IconButton>

      <DetailDataDisplay feature={feature} />
    </div>
  );
};
