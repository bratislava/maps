import { Marker } from "@bratislava/react-mapbox";
import cx from "classnames";
import { Feature, Point } from "geojson";
import { MouseEvent, useCallback } from "react";

import { ReactComponent as MarkerInactiveIcon } from "../assets/icons/fixpointsAndSyringeExchanges/fixpoint.svg";
import { ReactComponent as MarkerActiveIcon } from "../assets/icons/fixpointsAndSyringeExchanges/fixpoint-active.svg";

export interface IFixpointMarkerProps {
  feature: Feature<Point>;
  onClick: (feature: Feature<Point>) => void;
  isSelected?: boolean;
}

export const FixpointMarker = ({ feature, onClick, isSelected = false }: IFixpointMarkerProps) => {
  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick && onClick(feature);
    },
    [feature, onClick],
  );
  return (
    <Marker zIndex={1} onClick={onClickHandler} feature={feature}>
      <div
        className={cx(
          "relative transform active:scale-75 transition-transform cursor-pointer flex items-center justify-center",
          { "z-50": isSelected },
        )}
      >
        {isSelected ? (
          <MarkerActiveIcon width={32} height={32} />
        ) : (
          <MarkerInactiveIcon width={32} height={32} />
        )}
      </div>
    </Marker>
  );
};
