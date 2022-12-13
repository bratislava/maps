import { Marker } from "@bratislava/react-mapbox";
import cx from "classnames";
import { motion } from "framer-motion";
import { Feature, Point } from "geojson";
import { MouseEvent, useCallback } from "react";

import { ReactComponent as MarkerInactiveIcon } from "../assets/icons/fixpointsAndSyringeExchanges/fixpoint-and-syringe-exchange.svg";
import { ReactComponent as MarkerActiveIcon } from "../assets/icons/fixpointsAndSyringeExchanges/fixpoint-and-syringe-exchange-active.svg";

export interface IFixpointAndSyringeExchangeMarkerProps {
  feature: Feature<Point>;
  onClick: (feature: Feature<Point>) => void;
  isSelected?: boolean;
}

export const FixpointAndSyringeExchangeMarker = ({
  feature,
  onClick,
  isSelected = false,
}: IFixpointAndSyringeExchangeMarkerProps) => {
  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick && onClick(feature);
    },
    [feature, onClick],
  );

  return (
    <Marker zIndex={1} onClick={onClickHandler} feature={feature}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, type: "easeOut" }}
        className={cx(
          "relative transform active:scale-75 transition-transform cursor-pointer flex items-center justify-center",
          { "z-50": isSelected },
        )}
      >
        {isSelected ? (
          <MarkerActiveIcon width={45} height={32} />
        ) : (
          <MarkerInactiveIcon width={45} height={32} />
        )}
      </motion.div>
    </Marker>
  );
};
