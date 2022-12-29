import { Feature } from "geojson";
import cx from "classnames";

export interface ISingleFeatureMarkerProps {
  feature: Feature;
  isSelected: boolean;
}

export const SingleFeatureMarker = ({ feature, isSelected }: ISingleFeatureMarkerProps) => {
  return (
    <div className="relative cursor-pointer w-6 h-6">
      <div
        className={cx(
          "absolute -z-10 w-full h-full rounded-full !outline outline-[transparent] outline-offset-2 transition-all",
          {
            "bg-occupied": feature.properties?.occupancy === "occupied",
            "bg-free": feature.properties?.occupancy === "free",
            "bg-for-rent": feature.properties?.occupancy === "forRent",
            "outline-2 !outline-occupied":
              isSelected && feature.properties?.occupancy === "occupied",
            "outline-2 !outline-free": isSelected && feature.properties?.occupancy === "free",
            "outline-2 !outline-for-rent":
              isSelected && feature.properties?.occupancy === "forRent",
          },
        )}
      ></div>
    </div>
  );
};
