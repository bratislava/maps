import { Feature } from "geojson";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import cx from "classnames";
import { SingleFeatureDetail } from "./SingleFeatureDetail";
import { useResizeDetector } from "react-resize-detector";
import { useWindowSize } from "usehooks-ts";
export interface DetailProps {
  feature?: Feature | null;
  onClose: () => void;
  isMobile: boolean;
}

export const Detail = ({ feature, onClose, isMobile }: DetailProps) => {
  const sheetRef = useRef<BottomSheetRef>(null);

  const [currentSnap, setCurrentSnap] = useState(0);

  const onSnapChange = useCallback(() => {
    requestAnimationFrame(() => setCurrentSnap(sheetRef.current?.height === 84 ? 1 : 0));
  }, []);

  useEffect(() => {
    if (feature) {
      sheetRef.current?.snapTo(({ snapPoints }) => snapPoints[1]);
    }
  }, [feature, sheetRef]);

  const detail = useMemo(() => {
    return feature ? (
      <SingleFeatureDetail
        isExpanded={currentSnap === 0 || !isMobile}
        feature={feature}
        onClose={onClose}
      />
    ) : null;
  }, [currentSnap, feature, onClose, isMobile]);

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
      className={cx(
        "w-96 overflow-auto max-h-screen bg-background-lightmode dark:bg-background-darkmode",
        {
          "translate-x-full": !feature,
          "shadow-lg": feature,
          "rounded-bl-lg": shouldBeBottomLeftCornerRounded,
        },
      )}
    >
      {detail}
    </div>
  );
};

export default Detail;
