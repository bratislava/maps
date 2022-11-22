import { Feature } from "geojson";
import { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from "react";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import cx from "classnames";
import {
  DrikingFountainDetail,
  drinkingFountainFeaturePropertiesSchema,
} from "./DrinkingFountainDetail";
import { IconButton } from "@bratislava/react-maps-ui";
import { X } from "@bratislava/react-maps-icons";
import { MainDetail, mainFeaturePropertiesSchema } from "./MainDetail";
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
      try {
        const props = mainFeaturePropertiesSchema.parse(feature?.properties);
        return <MainDetail properties={props} isExpanded={currentSnap === 0 || !isMobile} />;
      } catch {
        // Who cares?
      }

      try {
        const props = drinkingFountainFeaturePropertiesSchema.parse(feature?.properties);
        return <DrikingFountainDetail {...props} />;
      } catch {
        // Who cares?
      }

      return null;
    }, [currentSnap, feature, isMobile]);

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
        <IconButton
          className={cx(
            "hidden w-8 h-8 rounded-full absolute right-6 top-6 md:flex items-center justify-center",
            { "!shadow-none": !feature?.properties?.picture },
          )}
          onClick={onClose}
        >
          <X size="sm" />
        </IconButton>
        {detail}
      </div>
    );
  },
);

Detail.displayName = "Detail";

export default Detail;
