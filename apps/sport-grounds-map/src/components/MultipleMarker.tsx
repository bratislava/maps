import React, { MouseEvent, useCallback, useMemo } from "react";
import { Marker as MapMarker } from "@bratislava/react-mapbox";
import { Feature, Point } from "geojson";
import { Icon } from "./Icon";
import cx from "classnames";

export interface IMultipleMarkerProps {
  features: Feature<Point>[];
  lng: number;
  lat: number;
  isSelected: boolean;
  onClick: (feature: Feature<Point>) => void;
}

export const MultipleMarker = ({
  features,
  lng,
  lat,
  onClick,
  isSelected,
}: IMultipleMarkerProps) => {
  const correctedFeature = useMemo(
    () => ({
      ...features[0],
      geometry: {
        ...features[0].geometry,
        coordinates: [lng, lat],
      },
    }),
    [features, lat, lng],
  );

  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick && onClick(correctedFeature);
    },
    [onClick, correctedFeature],
  );

  return (
    <MapMarker
      className={cx(
        "relative transform active:scale-75 transition-transform cursor-pointer w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg",
        { "bg-white text-primary z-50": isSelected, "bg-primary text-white": !isSelected },
      )}
      ignoreFilters
      onClick={onClickHandler}
      feature={correctedFeature}
    >
      <div
        className={cx(
          "absolute top-0 -right-1 rounded-full min-w-[24px] px-2 h-6 text font-bold flex items-center shadow-lg",
          { "bg-primary text-white": isSelected, "bg-white text-primary": !isSelected },
        )}
      >
        {features.length}
      </div>
      <Icon size={64} icon={features[0].properties?.icon ?? ""} />
    </MapMarker>
  );
};
