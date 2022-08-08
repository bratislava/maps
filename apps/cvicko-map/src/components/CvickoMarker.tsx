import { IMarkerProps, Marker } from "@bratislava/react-mapbox";
import { motion } from "framer-motion";

import { ReactComponent as CvickoIcon } from "../assets/icons/cvicko.svg";

import { ReactComponent as OtherCvickoIcon } from "../assets/icons/cvicko-other.svg";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

const cvickoIdToOffsetMappingObject: {
  [cvickoId: string]: { top?: number; right?: number; bottom?: number; left?: number };
} = {
  apollo: { bottom: 80 },
  lafranconi: { top: 90, left: 30 },
  "most-snp": { bottom: 80 },
  nabezie: { top: 90, right: 40 },
  promenada: { top: 90 },
  tyrsak: { bottom: 80 },
};

export interface ICvickoMarkerProps extends IMarkerProps {
  cvickoId: string;
  isSelected: boolean;
  onClick: () => void;
  isHomepage: boolean;
}

export const CvickoMarker = ({
  cvickoId,
  feature,
  isHomepage,
  isSelected,
  onClick,
}: ICvickoMarkerProps) => {
  const { t } = useTranslation();

  const [isHovered, setHovered] = useState(false);

  const isLargeIcon = useMemo(() => {
    return isSelected || isHomepage;
  }, [isHomepage, isSelected]);

  const offsetObject = useMemo(() => {
    return cvickoIdToOffsetMappingObject[cvickoId] ?? {};
  }, [cvickoId]);

  return (
    <>
      {isLargeIcon && (
        <Marker feature={feature} baseZoom={15} isRelativeToZoom onClick={onClick}>
          <div className="relative flex items-center justify-center ">
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: isSelected ? 1 : 0.7,
                x: (offsetObject.right ?? 0) - (offsetObject.left ?? 0),
                y: (offsetObject.bottom ?? 0) - (offsetObject.top ?? 0),
              }}
              transition={{ duration: 0.5 }}
              className="absolute flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="w-48 flex items-center justify-center rounded-full">
                <CvickoIcon width={400} height={100} />
              </div>
              <span className="font-laca -mt-2 text-[#ce9b5f] dark:text-foreground-darkmode outline-4 italic font-bold text-[40px] whitespace-nowrap drop-shadow-[2px_2px_0_#ffddd1] dark:drop-shadow-[2px_2px_0_#cf7444]">
                {t(`cvicko.${cvickoId}`)}
              </span>
            </motion.div>
          </div>
        </Marker>
      )}
      {!isHomepage && (
        <Marker feature={feature} onClick={onClick}>
          <div className="relative flex items-center justify-center ">
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: isHovered && !isSelected ? 1 : 0,
                x: (offsetObject.right ?? 0) - (offsetObject.left ?? 0),
                y: (offsetObject.bottom ?? 0) - (offsetObject.top ?? 0),
              }}
              transition={{ duration: 0.2 }}
              className="absolute flex flex-col items-center justify-center pointer-events-none"
            >
              <span className="bg-[#BDEBFF] p-4 rounded text-[#D85D30] whitespace-nowrap font-semibold text-[20px] shadow-lg">
                Cvičko {t(`cvicko.${cvickoId}`)}
              </span>
            </motion.div>
          </div>
        </Marker>
      )}
      <Marker baseZoom={15} isRelativeToZoom feature={feature} onClick={onClick}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isSelected ? 0.7 : 1 }}
          transition={{ duration: 0.5 }}
          onMouseMove={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <OtherCvickoIcon />
        </motion.div>
      </Marker>
    </>
  );
};
