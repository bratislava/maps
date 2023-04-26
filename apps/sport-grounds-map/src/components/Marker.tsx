import { MouseEvent, useCallback } from "react";
import { Marker as MapMarker } from "@bratislava/react-mapbox";
import { Feature, Point } from "geojson";
import { Icon } from "./Icon";

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
      <Icon isActicve={isSelected} size={64} icon={feature.properties?.icon ?? ""} />
    </MapMarker>
  );
};
