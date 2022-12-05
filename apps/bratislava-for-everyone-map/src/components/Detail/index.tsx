import { Feature } from "geojson";
import { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from "react";
import {
  DrikingFountainDetail,
  drinkingFountainFeaturePropertiesSchema,
} from "./DrinkingFountainDetail";
import { Detail as MapDetail, DetailHandle } from "@bratislava/react-maps";
import { MainDetail, mainFeaturePropertiesSchema } from "./MainDetail";
import { ITerrainService } from "../Layers";
import { TerrainServiceDetail } from "./TerrainServiceDetail";
export interface DetailProps {
  feature?: Feature | null;
  onClose: () => void;
  isMobile: boolean;
  activeTerrainService: ITerrainService | null;
  isVisible: boolean;
}

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ feature, onClose, isMobile, activeTerrainService, isVisible }, forwardedRef) => {
    const detailRef = useRef<DetailHandle>(null);

    const [currentHeight, setCurrentHeight] = useState(0);

    const onSnapChange = useCallback((height: number) => {
      setCurrentHeight(height);
    }, []);

    useEffect(() => {
      if (feature || activeTerrainService) {
        detailRef.current?.snapTo(1);
      }
    }, [feature, activeTerrainService, detailRef]);

    const detail = useMemo(() => {
      if (activeTerrainService) {
        console.log("ehjeheh");
        return <TerrainServiceDetail service={activeTerrainService} />;
      }

      try {
        const props = mainFeaturePropertiesSchema.parse(feature?.properties);
        return <MainDetail properties={props} isExpanded={currentHeight !== 84 || !isMobile} />;
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
    }, [activeTerrainService, currentHeight, feature, isMobile]);

    return (
      <MapDetail
        ref={detailRef}
        isBottomSheet={isMobile}
        onClose={onClose}
        isVisible={isVisible}
        bottomSheetSnapPoints={({ maxHeight }) => [maxHeight, maxHeight / 2, 84]}
        bottomSheetDefaultSnapPointIndex={1}
        onBottomSheetSnapChange={onSnapChange}
      >
        <div ref={forwardedRef}>{detail}</div>
      </MapDetail>
    );
  },
);

Detail.displayName = "Detail";
