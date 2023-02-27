import { forwardRef } from "react";
import { Feature } from "geojson";
export interface DetailProps {
  isMobile: boolean;
  feature: Feature | null;
  onClose: () => void;
}
import { Detail as MapDetail } from "@bratislava/react-maps";
import { DynamicDetail } from "./DynamicDetail";
import type { IFeatureProps } from "../../utils/utils";

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ feature, isMobile, onClose }, forwardedRef) => {

    return (
      <MapDetail
        isBottomSheet={isMobile}
        onClose={onClose}
        isVisible={!!feature}
        bottomSheetSnapPoints={[84, "50%", "100%"]}
        bottomSheetInitialSnap={1}
      >
        <div ref={forwardedRef} className="px-6 py-4">
          <DynamicDetail feature={feature?.properties as IFeatureProps} />
        </div>
      </MapDetail>
    );
  },
);

Detail.displayName = "Detail";

export default Detail;
