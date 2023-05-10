import { forwardRef } from "react";
import { Feature, Point } from "geojson";
import { Detail as MapDetail } from "@bratislava/react-maps";
import SwimmingPoolDetail from "./SwimmingPoolDetail";
import CvickoDetail from "./CvickoDetail";

export interface DetailProps {
  feature: Feature<Point> | null;
  onClose: () => void;
  isMobile: boolean;
}

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ feature, isMobile, onClose }, forwardedRef) => {

    if (!feature) return null;

    const detail = (
      <>
        {feature?.properties?.layer === "swimmingPools" ? (
          <SwimmingPoolDetail isMobile={isMobile} feature={feature} onClose={onClose} />
        ) : feature?.properties?.layer === "cvicko" ? (
          <CvickoDetail isMobile={isMobile} feature={feature} onClose={onClose} />
        ) : null}
      </>
    );

    return (
      <MapDetail
        isBottomSheet={isMobile}
        hideBottomSheetHeader={true}
        onClose={onClose}
        isVisible={!!feature}
        bottomSheetSnapPoints={[84, "100%", "100%"]}
        bottomSheetInitialSnap={1}
      >
        <div ref={forwardedRef} >
          {feature?.properties &&
            detail
          }

        </div>
      </MapDetail>
    )
  });

Detail.displayName = "Detail";

export default Detail;




