import React, { MouseEvent, useCallback } from "react";
import { Marker as MapMarker } from "@bratislava/react-mapbox";
import { Feature, Point } from "geojson";
import { Icon } from "./Icon";
import cx from "classnames";

export interface IMarkerProps {
  feature: Feature<Point>;
  onClick: (feature: Feature<Point>) => void;
  isSelected: boolean;
}

export const Marker = ({ feature, onClick, isSelected }: IMarkerProps) => {
  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick && onClick(feature);
    },
    [feature, onClick],
  );

  return (
    <MapMarker ignoreFilters onClick={onClickHandler} feature={feature}>
      <div
        className={cx(
          "relative transform active:scale-75 transition-transform cursor-pointer w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg",
          { "bg-white text-primary z-50": isSelected, "bg-primary text-white": !isSelected },
        )}
      >
        <Icon size={64} icon={feature.properties?.icon ?? ""} />
      </div>
    </MapMarker>
  );
};
