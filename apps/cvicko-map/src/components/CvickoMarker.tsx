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

export interface ICvickoMarkerProps extends IMarkerProps {
  cvickoId: string;
  currentCvickoId: string;
}

export const CvickoMarker = ({ cvickoId, currentCvickoId, feature }: ICvickoMarkerProps) => {
  const IconComponent = cvickoIdToIconComponentMappingObject[cvickoId] ?? OtherCvickoIcon;

  return (
    <Marker feature={feature}>
      {currentCvickoId === cvickoId ? (
        <div className="w-32 h-32 flex p-2 items-center justify-center bg-white border-foreground-lightmode border-2 rounded-full">
          <IconComponent />
        </div>
      ) : (
        <div className="">
          <OtherCvickoIcon />
        </div>
      )}
    </Marker>
  );
};
