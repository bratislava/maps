import { forwardRef, useState } from "react";
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

    const [snap, setSnap] = useState<number>(1)

    if (!feature) return null;

    const detail = (
      <>
        {feature?.properties?.layer === "swimmingPools" ? (
          <SwimmingPoolDetail isMobile={isMobile} feature={feature} onClose={onClose} displayHeader={snap > 0} />
        ) : feature?.properties?.layer === "cvicko" ? (
          <CvickoDetail isMobile={isMobile} feature={feature} onClose={onClose} displayHeader={snap > 0} />
        ) : null}
      </>
    );

    return (
      <MapDetail
        isBottomSheet={isMobile}
        hideBottomSheetHeader={snap > 0}
        onClose={onClose}
        isVisible={!!feature}
        bottomSheetSnapPoints={[84, "60%", "100%"]}
        bottomSheetInitialSnap={snap}
        onBottomSheetSnapChange={(snap) => setSnap(snap)}
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
