import { Marker } from "@bratislava/react-mapbox";
import { motion } from "framer-motion";

import { ReactComponent as PlayIcon } from "../assets/icons/play.svg";

import { point } from "@turf/helpers";

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
}: IRunningTrackButtonMarkerProps): JSX.Element => {
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
        <div className="font-semibold text-md whitespace-nowrap">{length}</div>
        <PlayIcon width={24} />
      </motion.button>
    </Marker>
  );
};
