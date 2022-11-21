import { Feature } from "geojson";
import { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from "react";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import cx from "classnames";
import { SingleFeatureDetail } from "./SingleFeatureDetail";
export interface DetailProps {
  feature?: Feature | null;
  onClose: () => void;
  isMobile: boolean;
  shouldBeBottomLeftCornerRounded: boolean;
}

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ feature, onClose, isMobile, shouldBeBottomLeftCornerRounded }, forwardedRef) => {
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
    ) : (
      <div
        ref={forwardedRef}
        className={cx("w-96 bg-background-lightmode dark:bg-background-darkmode", {
          "shadow-lg": feature,
          "rounded-bl-lg": shouldBeBottomLeftCornerRounded,
        })}
      >
        {detail}
      </div>
    );
  },
);

Detail.displayName = "Detail";

export default Detail;
