import React, { useCallback, useRef, useState } from "react";
import { Feature, Point } from "geojson";
import SportGroundDetail from "./SportGroundDetail";
import SwimmingPoolDetail from "./SwimmingPoolDetail";
import CvickoDetail from "./CvickoDetail";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";

export interface DetailProps {
  feature: Feature<Point> | null;
  onClose: () => void;
  isMobile: boolean;
}

export const Detail = ({ feature, onClose, isMobile }: DetailProps) => {
  const sheetRef = useRef<BottomSheetRef>(null);

  const [currentSnap, setCurrentSnap] = useState(0);

  const onSnapChange = useCallback(() => {
    requestAnimationFrame(() => setCurrentSnap(sheetRef.current?.height === 88 ? 1 : 0));
  }, []);

  if (!feature) return null;

  const detail = (
    <>
      {feature?.properties?.layer === "sportGrounds" ? (
        <SportGroundDetail feature={feature} onClose={onClose} />
      ) : feature?.properties?.layer === "swimmingPools" ? (
        <SwimmingPoolDetail isExpanded={currentSnap === 0} feature={feature} onClose={onClose} />
      ) : feature?.properties?.layer === "cvicko" ? (
        <CvickoDetail isExpanded={currentSnap === 0} feature={feature} onClose={onClose} />
      ) : null}
      {/* <pre className="p-2 h-72 bg-black text-white overflow-auto">
        <code>{JSON.stringify(feature?.properties, null, 2)}</code>
      </pre> */}
    </>
  );

  return isMobile ? (
    <BottomSheet
      ref={sheetRef}
      snapPoints={({ maxHeight }) => [maxHeight, 88]}
      defaultSnap={({ snapPoints }) => snapPoints[0]}
      blocking={false}
      onSpringStart={onSnapChange}
      className="relative z-30"
      open={true}
      expandOnContentDrag
    >
      {detail}
    </BottomSheet>
  ) : (
    detail
  );
};

export default Detail;
