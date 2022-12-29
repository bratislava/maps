import { Feature } from "geojson";
import { useState, useEffect, useRef, useMemo, forwardRef } from "react";
import { SingleFeatureDetail } from "./SingleFeatureDetail";
import { MultiFeatureDetail } from "./MultiFeatureDetail";
import { Detail as MapDetail } from "@bratislava/react-maps";
import { SheetHandle } from "@bratislava/react-maps-ui";
export interface DetailProps {
  features: Feature[];
  onClose: () => void;
  isMobile: boolean;
  avoidMapboxControls?: boolean;
}

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ features, onClose, isMobile, avoidMapboxControls = false }, forwardedRef) => {
    const detailRef = useRef<SheetHandle>(null);

    const [feature, setFeature] = useState<Feature | null>(null);
    const [currentSnap, setCurrentSnap] = useState(0);

    useEffect(() => {
      setFeature(null);

      const firstFeature = features[0];
      if (firstFeature) {
        setFeature(firstFeature);
      }
    }, [features]);

    useEffect(() => {
      if (feature) {
        detailRef.current?.snapTo(1);
      }
    }, [feature, detailRef]);

    const detail = useMemo(() => {
      if (features.length === 1) {
        return (
          <SingleFeatureDetail isExpanded={currentSnap !== 0 || !isMobile} feature={features[0]} />
        );
      }
      if (features.length > 1) {
        return <MultiFeatureDetail features={features} />;
      }
      return null;
    }, [currentSnap, features, isMobile]);

    return (
      <MapDetail
        ref={detailRef}
        isBottomSheet={isMobile}
        onClose={onClose}
        isVisible={!!feature}
        bottomSheetSnapPoints={[84, "50%", "100%"]}
        bottomSheetInitialSnap={1}
        onBottomSheetSnapChange={setCurrentSnap}
        hideBottomSheetHeader
        avoidMapboxControls={avoidMapboxControls}
      >
        <div ref={forwardedRef}>{detail}</div>
      </MapDetail>
    );
  },
);

Detail.displayName = "Detail";

export default Detail;
