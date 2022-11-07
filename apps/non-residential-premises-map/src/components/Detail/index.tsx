import { Feature } from "geojson";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import cx from "classnames";
import { SingleFeatureDetail } from "./SingleFeatureDetail";
import { MultiFeatureDetail } from "./MultiFeatureDetail";
import { useResizeDetector } from "react-resize-detector";
import { useWindowSize } from "usehooks-ts";
export interface DetailProps {
  features: Feature[];
  onClose: () => void;
  isMobile: boolean;
}

export const Detail = ({ features, onClose, isMobile }: DetailProps) => {
  const sheetRef = useRef<BottomSheetRef>(null);

  const [feature, setFeature] = useState<Feature | null>(null);
  const [currentSnap, setCurrentSnap] = useState(0);

  const onSnapChange = useCallback(() => {
    requestAnimationFrame(() => setCurrentSnap(sheetRef.current?.height === 84 ? 1 : 0));
  }, []);

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
      return (
        <SingleFeatureDetail
          isExpanded={currentSnap === 0}
          feature={features[0]}
          onClose={onClose}
        />
      );
    }
    if (features.length > 1) {
      return <MultiFeatureDetail features={features} onClose={onClose} />;
    }
    return null;
  }, [currentSnap, features, onClose]);

  const { ref: detailRef, height: detailHeight = 0 } = useResizeDetector();
  const { height: windowHeight } = useWindowSize();

  const shouldBeBottomLeftCornerRounded = useMemo(() => {
    return windowHeight !== detailHeight;
  }, [windowHeight, detailHeight]);

  return isMobile ? (
    <BottomSheet
      ref={sheetRef}
      snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 2, 84]}
      defaultSnap={({ snapPoints }) => snapPoints[1]}
      expandOnContentDrag
      blocking={false}
      className="relative z-30"
      open={!!feature}
      onSpringStart={onSnapChange}
    >
      {detail}
    </BottomSheet>
  ) : !feature ? null : (
    <div
      ref={detailRef}
      className={cx("w-96 overflow-hidden bg-background-lightmode dark:bg-background-darkmode", {
        "translate-x-full": !feature,
        "shadow-lg": feature,
        "rounded-bl-lg": shouldBeBottomLeftCornerRounded,
      })}
    >
      {detail}
    </div>
  );
};

export default Detail;
