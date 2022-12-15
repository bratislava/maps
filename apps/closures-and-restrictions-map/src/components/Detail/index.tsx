import { forwardRef, useEffect, useMemo, useRef } from "react";
import { Feature } from "geojson";
import DigupDetail, {
  DigupClosureDisorderProperties,
  digupClosureDisorderPropertiesSchema,
} from "./DigupClosureDisorderDetail";
import RepairPointDetail, {
  RepairPointDetailProperties,
  repairPointPropertiesSchema,
} from "./RepairPointDetail";
import RepairPolygonDetail, {
  RepairPolygonDetailProperties,
  repairPolygonPropertiesSchema,
} from "./RepairPolygonDetail";
export interface DetailProps {
  isMobile: boolean;
  feature: Feature | null;
  onClose: () => void;
}
import { Detail as MapDetail } from "@bratislava/react-maps";
import { SheetHandle } from "@bratislava/react-maps-ui";

export const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ feature, isMobile, onClose }, forwardedRef) => {
    const detailRef = useRef<SheetHandle>(null);

    const { /* originalProperties, */ ...processedProperties } = feature?.properties ?? {};

    const isOpen = useMemo(() => !!feature, [feature]);

    const detail = useMemo(
      () => (
        <div>
          {feature ? (
            digupClosureDisorderPropertiesSchema.safeParse(processedProperties).success ? (
              <DigupDetail properties={processedProperties as DigupClosureDisorderProperties} />
            ) : repairPolygonPropertiesSchema.safeParse(processedProperties).success ? (
              <RepairPolygonDetail
                properties={processedProperties as RepairPolygonDetailProperties}
              />
            ) : repairPointPropertiesSchema.safeParse(processedProperties).success ? (
              <RepairPointDetail properties={processedProperties as RepairPointDetailProperties} />
            ) : null
          ) : null}
          {/* <pre className="p-2 bg-black rounded-lg text-white overflow-auto">
            <div className="font-semibold">Processed properties</div>
            <code>{JSON.stringify(processedProperties, null, 2)}</code>
          </pre>
          <pre className="p-2 bg-black rounded-lg text-white overflow-auto">
            <div className="font-semibold">Original properties</div>
            <code>
              {JSON.stringify(
                typeof originalProperties === "string"
                  ? JSON.parse(originalProperties)
                  : originalProperties,
                null,
                2,
              )}
            </code>
          </pre> */}
        </div>
      ),
      [feature, processedProperties],
    );

    useEffect(() => {
      if (isOpen) {
        detailRef.current?.snapTo(1);
      }
    }, [detail, isOpen]);

    return (
      <MapDetail
        ref={detailRef}
        isBottomSheet={isMobile}
        onClose={onClose}
        isVisible={!!feature}
        bottomSheetSnapPoints={[84, "50%", "100%"]}
        bottomSheetInitialSnap={1}
      >
        <div ref={forwardedRef} className="px-6 py-4">
          {detail}
        </div>
      </MapDetail>
    );
  },
);

Detail.displayName = "Detail";

export default Detail;
