import { IMarkerProps, Marker } from "@bratislava/react-mapbox";

import { ReactComponent as CvickoIcon } from "../assets/icons/cvicko.svg";

import { ReactComponent as OtherCvickoIcon } from "../assets/icons/cvicko-other.svg";
import { useTranslation } from "react-i18next";

const cvickoIdToOffsetMappingObject: {
  [cvickoId: string]: { top?: number; right?: number; bottom?: number; left?: number };
} = {
  apollo: { top: 120 },
  lafranconi: { bottom: 150, right: 50 },
  "most-snp": { top: 120 },
  nabrezie: { bottom: 120, left: 40 },
  promenada: { bottom: 120 },
  tyrsak: { top: 120 },
};

export interface ICvickoMarkerProps extends IMarkerProps {
  cvickoId: string;
  currentCvickoId: string;
}

export const CvickoMarker = ({ cvickoId, currentCvickoId, feature }: ICvickoMarkerProps) => {
  const { t } = useTranslation();
  return (
    <Marker feature={feature}>
      {currentCvickoId === cvickoId ? (
        <div className="flex relative items-center justify-center ">
          <div className="absolute bg-primary rounded-full w-4 h-4"></div>
          <div
            className="absolute flex flex-col items-center"
            style={{
              paddingTop: cvickoIdToOffsetMappingObject[cvickoId].top,
              paddingRight: cvickoIdToOffsetMappingObject[cvickoId].right,
              paddingBottom: cvickoIdToOffsetMappingObject[cvickoId].bottom,
              paddingLeft: cvickoIdToOffsetMappingObject[cvickoId].left,
            }}
          >
            <div className="w-32 flex items-center justify-center rounded-full">
              <CvickoIcon />
            </div>
            <span className="font-laca -mt-1 text-[#ce9b5f] dark:text-foreground-darkmode outline-4 italic font-bold text-[26px] drop-shadow-[2px_2px_0_#ffddd1] dark:drop-shadow-[2px_2px_0_#cf7444]">
              {t(`cvicko.${cvickoId}`)}
            </span>
          </div>
        </div>
      ) : (
        <div className="">
          <OtherCvickoIcon />
        </div>
      )}
    </Marker>
  );
};
