import { Detail as MapDetail } from "@bratislava/react-maps";
import { GeoJsonProperties, Geometry } from "@bratislava/utils/src/types";
import { Feature } from "geojson";
import { forwardRef } from "react";
import { IFeatureProps } from "../../types/featureTypes";
import { DynamicDetail } from "./DynamicDetail";
export interface DetailProps {
  isMobile: boolean;
  feature: Feature | null;
  onClose: () => void;
}


export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ feature, isMobile, onClose }, forwardedRef) => {

    const getStreetViewUrl = (feature: Feature<Geometry, GeoJsonProperties> | null): string => {
      if (feature?.geometry.type !== 'Point') return '';
      return `http://maps.google.com/maps?q=&layer=c&cbll=${feature?.geometry?.coordinates[1]},${feature?.geometry?.coordinates[0]}`
    }

    return (
      <MapDetail
        isBottomSheet={isMobile}
        onClose={onClose}
        isVisible={!!feature}
        bottomSheetSnapPoints={[84, "50%", "100%"]}
        bottomSheetInitialSnap={1}
      >
        <div ref={forwardedRef} className="px-6 py-4">
          {feature?.properties &&
            < DynamicDetail
              featureProps={feature.properties as IFeatureProps}
              streetViewUrl={getStreetViewUrl(feature)}
            />
          }

        </div>
      </MapDetail>
    );
  },
);

Detail.displayName = "Detail";

export default Detail;
