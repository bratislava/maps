import { Marker } from "@bratislava/react-mapbox";
import cx from "classnames";
import { Feature, Point } from "geojson";
import { MouseEvent, useCallback } from "react";

import { ReactComponent as MarkerInactiveIcon } from "../assets/icons/fountains/marker.svg";
import { ReactComponent as MarkerActiveIcon } from "../assets/icons/fountains/marker-alt.svg";

export interface IDrinkingFountainMarkerProps {
  feature: Feature<Point>;
  onClick: (feature: Feature<Point>) => void;
  isSelected?: boolean;
  count?: number;
}

export const DrinkingFountainMarker = ({
  feature,
  onClick,
  isSelected = false,
  count,
}: IDrinkingFountainMarkerProps) => {
  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick && onClick(feature);
    },
    [feature, onClick],
  );

  return (
    <Marker zIndex={1} ignoreFilters onClick={onClickHandler} feature={feature}>
      <div
        className={cx(
          "relative transform active:scale-75 transition-transform cursor-pointer flex items-center justify-center",
          { "z-50": isSelected },
        )}
      >
        {count && (
          <div className="absolute text-white -top-[10px] -right-[14px] text-[10px] font-bold z-10 w-3 h-3 bg-[#024760] rounded-full flex items-center justify-center dark:bg-white dark:text-[#024760]">
            {count}
          </div>
        )}
        {isSelected ? (
          <MarkerActiveIcon className="absolute bottom-0" width={32} height={32} />
        ) : (
          <MarkerInactiveIcon className="absolute bottom-0" width={32} height={32} />
        )}
      </div>
    </Marker>
  );
};
