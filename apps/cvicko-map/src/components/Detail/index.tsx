import { forwardRef, useState } from "react";
import { Feature, Point } from "geojson";
import { Detail as MapDetail } from "@bratislava/react-maps";
import FountainDetail from "./FountainDetail";
import CvickoDetail from "./CvickoDetail";

export interface DetailProps {
  feature: Feature<Point> | null;
  fountain: Feature<Point> | null;
  onClose: () => void;
  isMobile: boolean;
}

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ feature, fountain, isMobile, onClose }, forwardedRef) => {

    const [snap, setSnap] = useState<number>(0)

    const displayHeader = snap > 0 || !isMobile;

    if (!feature && !fountain) return null;

    const detail = (
      <>
        {feature && <CvickoDetail isMobile={isMobile} feature={feature} onClose={onClose} displayHeader={displayHeader} />}
        {fountain && <FountainDetail isMobile={isMobile} feature={fountain} onClose={onClose} />}
      </>
    );

    return (
      <MapDetail
        isBottomSheet={isMobile}
        hideBottomSheetHeader={displayHeader}
        onClose={onClose}
        isVisible={!!feature || !!fountain}
        bottomSheetSnapPoints={[84, "60%", "100%"]}
        bottomSheetInitialSnap={snap}
        onBottomSheetSnapChange={(snap) => setSnap(snap)}
      >
        <div ref={forwardedRef} >
          {detail}
        </div>
      </MapDetail>
    )
  });

Detail.displayName = "Detail";

export default Detail;
