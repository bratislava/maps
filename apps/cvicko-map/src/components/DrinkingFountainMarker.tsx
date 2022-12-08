import { Marker as MapMarker } from "@bratislava/react-mapbox";
import cx from "classnames";
import { motion } from "framer-motion";
import { Feature, Point } from "geojson";
import React from "react";

import { ReactComponent as MarkerActiveIcon } from "../assets/icons/marker-active.svg";
import { ReactComponent as MarkerInactiveIcon } from "../assets/icons/marker-inactive.svg";
import type { TSelectedFeature } from "./App";

export interface IMarkerProps {
    feature: Feature<Point>;
    onClick: (arg1: TSelectedFeature, arg2: TSelectedFeature) => void;
    isSelected?: boolean;
    count?: number;
}

const DrinkingFountainMarker: React.FC<IMarkerProps> = ({ feature, onClick, isSelected = false, count }) => {
    return (
        <MapMarker ignoreFilters onClick={() => onClick(null, feature)} feature={feature}>
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
                    <div className="absolute text-white -top-[25px] -right-[20px] text-sm font-bold z-10 w-4 h-4 bg-primary-soft rounded-full flex items-center justify-center dark:bg-white dark:text-primary-soft">
                        {count}
                    </div>
                )}
                {isSelected ? (
                    <MarkerActiveIcon className="absolute bottom-0" width={24} height={24} />
                ) : (
                    <MarkerInactiveIcon className="absolute bottom-0" width={24} height={24} />
                )}
            </motion.div>
        </MapMarker>
    );
};

export default DrinkingFountainMarker;
