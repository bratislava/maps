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
    <MapMarker ignoreFilters onClick={onClickHandler} feature={correctedFeature}>
      <div
        className={cx(
          "relative transform active:scale-75 font-bold text-[16px] transition-transform cursor-pointer w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg",
          { "bg-white text-primary z-50": isSelected, "bg-primary text-white": !isSelected },
        )}
      >
        {features.length}
      </div>
    </MapMarker>
  );
};
