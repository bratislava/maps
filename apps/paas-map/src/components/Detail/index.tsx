import { X } from "@bratislava/react-maps-icons";
import cx from "classnames";
import { Feature, Point } from "geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { useRef } from "react";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
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

export interface DetailProps {
  feature: Feature<Point> | MapboxGeoJSONFeature | null;
  onClose: () => void;
  isOpen: boolean;
  isMobile: boolean;
}

export const Detail = ({ feature, isOpen, onClose, isMobile }: DetailProps) => {
  const sheetRef = useRef<BottomSheetRef>(null);

  const detail = (
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
  );

  return isMobile ? (
    <BottomSheet
      ref={sheetRef}
      snapPoints={({ maxHeight, minHeight }) => [maxHeight, minHeight, 80]}
      defaultSnap={({ snapPoints }) => snapPoints[1]}
      blocking={false}
      className="relative z-30"
      open={!!feature}
      expandOnContentDrag
    >
      <div className="p-8 text-foreground-lightmode dark:text-foreground-darkmode">{detail}</div>
    </BottomSheet>
  ) : (
    <div
      className={cx(
        "fixed top-0 right-0 w-96 text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode transition-all duration-500 p-6 border-l-2 border-b-2 border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20 rounded-bl-lg",
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

      <div>
        <pre className="p-2 mt-16 h-72 bg-black text-white overflow-auto">
          <code>{JSON.stringify(feature?.properties, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

export default Detail;
