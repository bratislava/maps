import { IMarkerProps, Marker } from "@bratislava/react-mapbox";
import { motion } from "framer-motion";

import { ReactComponent as CvickoApolloIcon } from "../assets/icons/cvicko-apollo.svg";
import { ReactComponent as CvickoLanfranconiIcon } from "../assets/icons/cvicko-lanfranconi.svg";
import { ReactComponent as CvickoPromenadaIcon } from "../assets/icons/cvicko-promenada.svg";
import { ReactComponent as CvickoMostSnpIcon } from "../assets/icons/cvicko-most-snp.svg";
import { ReactComponent as CvickoTyrsakIcon } from "../assets/icons/cvicko-tyrsak.svg";
import { ReactComponent as CvickoNabreziecon } from "../assets/icons/cvicko-nabrezie.svg";

import { ReactComponent as OtherCvickoIcon } from "../assets/icons/cvicko-other.svg";
import { useTranslation } from "react-i18next";
import { FC, SVGProps, useMemo, useState } from "react";

const cvickoIdToIconComponentObject: {
  [cvickoId: string]: FC<SVGProps<SVGSVGElement>>;
} = {
  apollo: CvickoApolloIcon,
  lanfranconi: CvickoLanfranconiIcon,
  "most-snp": CvickoMostSnpIcon,
  nabrezie: CvickoNabreziecon,
  promenada: CvickoPromenadaIcon,
  tyrsak: CvickoTyrsakIcon,
};

const cvickoIdToOffsetMappingObject: {
  [cvickoId: string]: { top?: number; right?: number; bottom?: number; left?: number };
} = {
  apollo: { bottom: 80 },
  lanfranconi: { top: 90, left: 30 },
  "most-snp": { bottom: 80 },
  nabrezie: { top: 90, right: 40 },
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

  const IconComponent = useMemo(() => {
    return cvickoIdToIconComponentObject[cvickoId] ?? {};
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
              <div className="flex items-center justify-center rounded-full">
                <IconComponent width={200} />
              </div>
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
              <span className="bg-[#BDEBFF] p-4 rounded text-[#D54127] whitespace-nowrap font-semibold text-[20px] shadow-lg">
                Cvičko {t(`cvicko.${cvickoId}`)}
              </span>
            </motion.div>
          </div>
        </Marker>
      )}
      <Marker baseZoom={15} isRelativeToZoom feature={feature} onClick={onClick}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isSelected ? 0.5 : 0.7 }}
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
