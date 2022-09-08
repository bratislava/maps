import { Slot } from "@bratislava/react-maps";
import { X } from "@bratislava/react-maps-icons";
import cx from "classnames";
import { Feature } from "geojson";
import { BottomSheet } from "react-spring-bottom-sheet";
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

export const Detail = ({ feature, isMobile, onClose }: DetailProps) => {
  const { originalProperties, ...processedProperties } = feature?.properties ?? {};

  const detail = !feature ? null : (
    <>
      <div className="p-8 text-foreground-lightmode dark:text-foreground-darkmode">
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
      </div>

      <pre className="p-2 m-2 bg-black rounded-lg text-white overflow-auto">
        <div className="font-semibold">Processed properties</div>
        <code>{JSON.stringify(processedProperties, null, 2)}</code>
      </pre>
      <pre className="p-2 m-2 bg-black rounded-lg text-white overflow-auto">
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
      </pre>
    </>
  );

  return isMobile ? (
    <Slot isVisible={!!feature} name="desktop-detail">
      <BottomSheet
        snapPoints={({ maxHeight }) => [(maxHeight / 5) * 3]}
        blocking={false}
        className="relative z-30"
        open={!!feature}
        draggable={false}
      >
        {detail}
      </BottomSheet>
    </Slot>
  ) : (
    <Slot
      openPadding={{ right: 384 }}
      avoidControls={true}
      isVisible={!!feature}
      name="desktop-detail"
    >
      <div
        className={cx(
          "fixed top-0 right-0 w-96 overflow-auto max-h-full bg-background-lightmode dark:bg-background-darkmode transition-all duration-500",
          {
            "translate-x-full": !feature,
            "shadow-lg": !!feature,
          },
        )}
      >
        <button onClick={onClose} className="absolute top-8 right-6 z-10 hover:text-primary">
          <X size="default" />
        </button>
        {detail}
      </div>
    </Slot>
  );
};

export default Detail;
