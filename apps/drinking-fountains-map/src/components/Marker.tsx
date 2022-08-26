import { Marker as MapMarker } from "@bratislava/react-mapbox";
import cx from "classnames";
import { motion } from "framer-motion";
import { Feature, Point } from "geojson";
import { MouseEvent, useCallback } from "react";

import { ReactComponent as MarkerActiveIcon } from "../assets/marker-active.svg";
import { ReactComponent as MarkerInactiveIcon } from "../assets/marker-inactive.svg";

export interface IMarkerProps {
  feature: Feature<Point>;
  onClick: (feature: Feature<Point>) => void;
  isSelected?: boolean;
  count?: number;
}

export const Marker = ({ feature, onClick, isSelected = false, count }: IMarkerProps) => {
  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick && onClick(feature);
    },
    [feature, onClick],
  );

  return (
    <MapMarker ignoreFilters onClick={onClickHandler} feature={feature}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, type: "easeOut" }}
        className={cx(
          "relative transform active:scale-75 transition-transform cursor-pointer flex items-center justify-center",
          { "z-50": isSelected },
        )}
      >
        {count && (
          <div className="absolute text-white -top-[52px] -right-[20px] text-sm font-bold z-10 w-4 h-4 bg-primary-soft rounded-full flex items-center justify-center dark:bg-white dark:text-primary-soft">
            {count}
          </div>
        )}
        {isSelected ? (
          <MarkerActiveIcon className="absolute bottom-0" width={48} height={48} />
        ) : (
          <MarkerInactiveIcon className="absolute bottom-0" width={48} height={48} />
        )}
      </motion.div>
    </MapMarker>
  );
};
