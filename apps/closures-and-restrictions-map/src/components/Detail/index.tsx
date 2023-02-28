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
import { GeoJsonProperties, Geometry } from "@bratislava/utils/src/types";

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ feature, isMobile, onClose }, forwardedRef) => {
    const getStreetViewUrl = (feature: Feature<Geometry, GeoJsonProperties> | null): string => {
      if (feature?.geometry.type !== "Point") return "";
      return `http://maps.google.com/maps?q=&layer=c&cbll=${feature?.geometry?.coordinates[1]},${feature?.geometry?.coordinates[0]}`;
    };

    return (
      <MapDetail
        isBottomSheet={isMobile}
        onClose={onClose}
        isVisible={!!feature}
        bottomSheetSnapPoints={[84, "50%", "100%"]}
        bottomSheetInitialSnap={1}
      >
        <div ref={forwardedRef} className="px-6 py-4">
          {feature?.properties && (
            <DynamicDetail
              featureProps={feature?.properties as IFeatureProps}
              streetViewUrl={getStreetViewUrl(feature)}
            />
          )}
        </div>
      </MapDetail>
    );
  },
);

Detail.displayName = "Detail";

export default Detail;
