import { Feature, Point } from "geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { useEffect, useMemo, useRef } from "react";
import AssistantDetail, { AssistantProperties, assistantPropertiesSchema } from "./AssistantDetail";
import BranchDetail, { BranchProperties, branchPropertiesSchema } from "./BranchDetail";
import ParkingLotDetail, {
  ParkingLotProperties,
  parkingLotPropertiesSchema,
} from "./ParkingLotDetail";
import ParkomatDetail, { ParkomatProperties, parkomatPropertiesSchema } from "./ParkomatDetail";
import PartnerDetail, { PartnerProperties, partnerPropertiesSchema } from "./PartnerDetail";
import ResidentDetail, { ResidentProperties, residentPropertiesSchema } from "./ResidentDetail";
import VisitorDetail, { VisitorProperties, visitorPropertiesSchema } from "./VisitorDetail";
import { Detail as MapDetail } from "@bratislava/react-maps";
import { SheetHandle } from "@bratislava/react-maps-ui";

export interface DetailProps {
  feature: Feature<Point> | MapboxGeoJSONFeature | null;
  onClose: () => void;
  isOpen: boolean;
  isMobile: boolean;
}

export const Detail = ({ feature, isOpen, onClose, isMobile }: DetailProps) => {
  const detailRef = useRef<SheetHandle>(null);

  const detail = useMemo(
    () => (
      <div>
        {feature ? (
          assistantPropertiesSchema.safeParse(feature.properties).success ? (
            <AssistantDetail properties={feature.properties as AssistantProperties} />
          ) : branchPropertiesSchema.safeParse(feature.properties).success ? (
            <BranchDetail properties={feature.properties as BranchProperties} />
          ) : residentPropertiesSchema.safeParse(feature.properties).success ? (
            <ResidentDetail properties={feature.properties as ResidentProperties} />
          ) : visitorPropertiesSchema.safeParse(feature.properties).success ? (
            <VisitorDetail properties={feature.properties as VisitorProperties} />
          ) : parkomatPropertiesSchema.safeParse(feature.properties).success ? (
            <ParkomatDetail properties={feature.properties as ParkomatProperties} />
          ) : partnerPropertiesSchema.safeParse(feature.properties).success ? (
            <PartnerDetail properties={feature.properties as PartnerProperties} />
          ) : parkingLotPropertiesSchema.safeParse(feature.properties).success ? (
            <ParkingLotDetail properties={feature.properties as ParkingLotProperties} />
          ) : null
        ) : null}
      </div>
    ),
    [feature],
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
      isVisible={isOpen}
      bottomSheetSnapPoints={[84, "content", "100%"]}
      bottomSheetInitialSnap={1}
    >
      <div className="px-6 py-4">{detail}</div>
    </MapDetail>
  );
};

export default Detail;
