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
          },
        )}
      >
        <div
          className={cx(
            "absolute -left-1 -right-1 -top-1 -bottom-1 rounded-full !border-2 border-[transparent]",
            {
              "!border-occupied": isSelected && feature.properties?.occupancy === "occupied",
              "!border-free": isSelected && feature.properties?.occupancy === "free",
              "!border-for-rent": isSelected && feature.properties?.occupancy === "forRent",
            },
          )}
        ></div>
      </div>
    </div>
  );
};
