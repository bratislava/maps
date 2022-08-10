import { Marker } from "@bratislava/react-mapbox";
import { motion } from "framer-motion";

import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";

import { useTranslation } from "react-i18next";
import { point } from "@turf/turf";

export interface IRunningTrackButtonMarkerProps {
  lat: number;
  lng: number;
  color: string;
  length: string;
  onClick: () => void;
  isVisible: boolean;
  isSmall?: boolean;
}

export const RunningTrackButtonMarker = ({
  lat,
  lng,
  color,
  length,
  onClick,
  isVisible,
  isSmall = false,
}: IRunningTrackButtonMarkerProps) => {
  return (
    <Marker
      isRelativeToZoom
      baseZoom={isSmall ? 15 : 14}
      feature={point([lng, lat])}
      onClick={onClick}
    >
      <motion.button
        animate={{ scale: isVisible ? 1 : 0 }}
        className="flex text-white px-3 gap-2 h-12 items-center rounded-lg cursor-pointer shadow-lg"
        style={{ background: color }}
      >
        <span className="font-semibold text-md">{length}</span>
        <PlayIcon width={24} />
      </motion.button>
    </Marker>
  );
};
