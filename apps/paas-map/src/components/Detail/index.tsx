import { useRef } from "react";
import cx from "classnames";
import { Feature, Point } from "geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import AssistantDetail, { AssistantProperties, assistantPropertiesSchema } from "./AssistantDetail";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import BranchDetail, { BranchProperties, branchPropertiesSchema } from "./BranchDetail";
import { X } from "@bratislava/react-maps-icons";
import GarageDetail, { GarageProperties, garagePropertiesSchema } from "./GarageDetail";
import ResidentDetail, { ResidentProperties, residentPropertiesSchema } from "./ResidentDetail";
import VisitorDetail, { VisitorProperties, visitorPropertiesSchema } from "./VisitorDetail";
import ParkomatDetail, { ParkomatProperties, parkomatPropertiesSchema } from "./ParkomatDetail";
import PartnerDetail, { PartnerProperties, partnerPropertiesSchema } from "./PartnerDetail";
import PPlusRDetail, { PPlusRProperties, pPlusRPropertiesSchema } from "./PPlusRDetail";

export interface DetailProps {
  feature: Feature<Point> | MapboxGeoJSONFeature | null;
  onClose: () => void;
  isOpen: boolean;
  isMobile: boolean;
}

export const Detail = ({ feature, isOpen, onClose, isMobile }: DetailProps) => {
  const sheetRef = useRef<BottomSheetRef>(null);

  if (!feature) return null;

  const detail = assistantPropertiesSchema.safeParse(feature.properties).success ? (
    <AssistantDetail properties={feature.properties as AssistantProperties} />
  ) : branchPropertiesSchema.safeParse(feature.properties).success ? (
    <BranchDetail properties={feature.properties as BranchProperties} />
  ) : garagePropertiesSchema.safeParse(feature.properties).success ? (
    <GarageDetail properties={feature.properties as GarageProperties} />
  ) : residentPropertiesSchema.safeParse(feature.properties).success ? (
    <ResidentDetail properties={feature.properties as ResidentProperties} />
  ) : visitorPropertiesSchema.safeParse(feature.properties).success ? (
    <VisitorDetail properties={feature.properties as VisitorProperties} />
  ) : parkomatPropertiesSchema.safeParse(feature.properties).success ? (
    <ParkomatDetail properties={feature.properties as ParkomatProperties} />
  ) : partnerPropertiesSchema.safeParse(feature.properties).success ? (
    <PartnerDetail properties={feature.properties as PartnerProperties} />
  ) : pPlusRPropertiesSchema.safeParse(feature.properties).success ? (
    <PPlusRDetail properties={feature.properties as PPlusRProperties} />
  ) : null;

  return !detail ? null : isMobile ? (
    <BottomSheet
      ref={sheetRef}
      snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 3]}
      defaultSnap={({ snapPoints }) => snapPoints[1]}
      blocking={false}
      className="relative z-30"
      open={true}
      expandOnContentDrag
      onDismiss={onClose}
    >
      <div className="p-8">{detail}</div>
    </BottomSheet>
  ) : (
    <div
      className={cx(
        "fixed top-0 right-0 w-96 bg-background-lightmode dark:bg-background-darkmode transition-all duration-500 p-6 border-l-2 border-b-2 border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20 rounded-bl-lg",
        {
          "translate-x-full": !isOpen,
          "shadow-lg": isOpen,
        },
      )}
    >
      <button onClick={onClose} className="absolute top-6 right-6 z-10 hover:text-primary">
        <X size="lg" />
      </button>
      {detail}
    </div>
  );
};

export default Detail;