import { IMarkerProps, Marker } from "@bratislava/react-mapbox";
import cx from "classnames";

import { ReactComponent as CvickoApolloIcon } from "../assets/icons/cvicko-apollo.svg";
import { ReactComponent as CvickoLafranconiIcon } from "../assets/icons/cvicko-lafranconi.svg";
import { ReactComponent as CvickoMostSnpIcon } from "../assets/icons/cvicko-most-snp.svg";
import { ReactComponent as CvickoNabrezieIcon } from "../assets/icons/cvicko-nabrezie.svg";
import { ReactComponent as CvickoPromenadaIcon } from "../assets/icons/cvicko-promenada.svg";
import { ReactComponent as CvickoTyrsakIcon } from "../assets/icons/cvicko-tyrsak.svg";
import { ReactComponent as OtherCvickoIcon } from "../assets/icons/cvicko-other.svg";
import { FC } from "react";

const cvickoIdToIconComponentMappingObject: { [cvickoId: string]: FC } = {
  apollo: CvickoApolloIcon,
  lafranconi: CvickoLafranconiIcon,
  "most-snp": CvickoMostSnpIcon,
  nabrezie: CvickoNabrezieIcon,
  promenada: CvickoPromenadaIcon,
  tyrsak: CvickoTyrsakIcon,
};

const cvickoIdToOffsetMappingObject: {
  [cvickoId: string]: { top?: number; right?: number; bottom?: number; left?: number };
} = {
  apollo: { top: 120 },
  lafranconi: { bottom: 120, right: 40 },
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
  const IconComponent = cvickoIdToIconComponentMappingObject[cvickoId] ?? OtherCvickoIcon;

  return (
    <Marker feature={feature}>
      {currentCvickoId === cvickoId ? (
        <div className="flex relative items-center justify-center ">
          <div className="absolute bg-primary rounded-full w-4 h-4"></div>
          <div
            className="absolute "
            style={{
              paddingTop: cvickoIdToOffsetMappingObject[cvickoId].top,
              paddingRight: cvickoIdToOffsetMappingObject[cvickoId].right,
              paddingBottom: cvickoIdToOffsetMappingObject[cvickoId].bottom,
              paddingLeft: cvickoIdToOffsetMappingObject[cvickoId].left,
            }}
          >
            <div className="w-32 h-32 flex items-center justify-center rounded-full">
              <IconComponent />
            </div>
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
