import React, { MouseEvent, useCallback, useMemo } from "react";
import { Marker as MapMarker } from "@bratislava/react-mapbox";
import { Feature, Point } from "geojson";
import { Icon } from "./Icon";

export interface IMarkerProps {
  features: Feature<Point>[];
  onClick: (feature: Feature<Point>) => void;
  isSelected: boolean;
  lat: number;
  lng: number;
}

export const Marker = ({ features, lat, lng, onClick, isSelected }: IMarkerProps) => {
  const feature = useMemo(
    () =>
      features.length
        ? ({
            ...features[0],
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
          } as Feature<Point>)
        : null,
    [features, lng, lat],
  );

  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick && feature && onClick(feature);
    },
    [feature, onClick],
  );

  return feature ? (
    <MapMarker
      baseZoom={15}
      isRelativeToZoom
      ignoreFilters
      onClick={onClickHandler}
      feature={feature}
    >
      <Icon
        isWhite={isSelected}
        count={features.length > 1 ? features.length : undefined}
        size={64}
        icon={feature.properties?.icon ?? ""}
      />
    </MapMarker>
  ) : null;
};
