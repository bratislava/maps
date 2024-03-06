import { Feature } from "geojson";
import { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from "react";

import {
  DrinkingFountainDetail,
  drinkingFountainFeaturePropertiesSchema,
} from "./DrinkingFountainDetail";

import {
  FixpointSyringeExchangeDetail,
  fixpointSyringeExchangeFeaturePropertiesSchema,
} from "./FixpointSyringeExchangeDetail";

import { OtherServiceDetail, otherServiceFeaturePropertiesSchema } from "./OtherServiceDetail";

import { Detail as MapDetail } from "@bratislava/react-maps";
import { MainDetail, mainFeaturePropertiesSchema } from "./MainDetail";
import { ITerrainService, TerrainServiceDetail } from "./TerrainServiceDetail";
import {
  terrainServicesDetailsPropertiesSchema,
  TerrainServiceDetails,
} from "./TerrainServiceDetails";
import { SheetHandle } from "@bratislava/react-maps-ui";

export interface DetailProps {
  feature?: Feature | null;
  onClose: () => void;
  isMobile: boolean;
  activeTerrainService: ITerrainService | null;
  isVisible: boolean;
}

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ feature, onClose, isMobile, activeTerrainService, isVisible }, forwardedRef) => {
    // console.log("-----------------");
    // console.log("-----------------");
    // console.log("-----------------");
    // console.log("-----------------");
    // console.log("-----------------");
    // console.log(activeTerrainService);
    // console.log(feature);

    const detailRef = useRef<SheetHandle>(null);

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
        return <TerrainServiceDetail service={activeTerrainService} />;
      }

      try {
        const props = mainFeaturePropertiesSchema.parse(feature?.properties);
        return (
          <MainDetail
            isMobile={isMobile}
            properties={props}
            isExpanded={currentHeight !== 84 || !isMobile}
          />
        );
      } catch {
        // Who cares?
      }

      try {
        const props = otherServiceFeaturePropertiesSchema.parse(feature?.properties);
        return <OtherServiceDetail {...props} />;
      } catch {
        // Who cares?
      }

      try {
        const props = fixpointSyringeExchangeFeaturePropertiesSchema.parse(feature?.properties);
        return <FixpointSyringeExchangeDetail {...props} />;
      } catch {
        // Who cares?
      }

      try {
        const props = drinkingFountainFeaturePropertiesSchema.parse(feature?.properties);
        return <DrinkingFountainDetail {...props} />;
      } catch {
        // Who cares?
      }

      try {
        const workingGroups = feature?.properties
          ? terrainServicesDetailsPropertiesSchema.parse(
              JSON.parse(feature?.properties.workingGroups),
            )
          : [];
        return <TerrainServiceDetails workingGroups={workingGroups} />;
      } catch (e) {
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
        bottomSheetSnapPoints={[84, "50%", "100%"]}
        bottomSheetInitialSnap={1}
        onBottomSheetSnapChange={onSnapChange}
      >
        <div ref={forwardedRef}>{detail}</div>
      </MapDetail>
    );
  },
);

Detail.displayName = "Detail";
