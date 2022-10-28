import { Feature } from "geojson";
import { useState, useEffect, useRef, useMemo } from "react";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import cx from "classnames";
import { SingleFeatureDetail } from "./SingleFeatureDetail";
import { MultiFeatureDetail } from "./MultiFeatureDetail";
export interface DetailProps {
  features: Feature[];
  onClose: () => void;
  isMobile: boolean;
}

export const Detail = ({ features, onClose, isMobile }: DetailProps) => {
  const sheetRef = useRef<BottomSheetRef>(null);

  const [feature, setFeature] = useState<Feature | null>(null);

  useEffect(() => {
    setFeature(null);

    const firstFeature = features[0];
    if (firstFeature) {
      setFeature(firstFeature);
    }
  }, [features]);

  useEffect(() => {
    if (feature) {
      sheetRef.current?.snapTo(({ snapPoints }) => snapPoints[1]);
    }
  }, [feature, sheetRef]);

  const detail = useMemo(() => {
    if (features.length === 1) {
      return <SingleFeatureDetail feature={features[0]} onClose={onClose} />;
    }
    if (features.length > 1) {
      return <MultiFeatureDetail features={features} onClose={onClose} />;
    }
    return null;
  }, [features, onClose]);

  return isMobile ? (
    <BottomSheet
      ref={sheetRef}
      snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 2, 80]}
      defaultSnap={({ snapPoints }) => snapPoints[1]}
      expandOnContentDrag
      blocking={false}
      className="relative z-30"
      open={!!feature}
    >
      {detail}
    </BottomSheet>
  ) : !feature ? null : (
    <div
      className={cx(
        "w-96 rounded-bl-lg overflow-hidden bg-background-lightmode dark:bg-background-darkmode",
        {
          "translate-x-full": !feature,
          "shadow-lg": feature,
        },
      )}
    >
      {detail}
    </div>
  );
};

export default Detail;
