import { Feature, Point } from "geojson";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Detail as MapDetail } from "@bratislava/react-maps";
import { Row } from "./Row";
import { SheetHandle } from "@bratislava/react-maps-ui";

export interface DetailProps {
  feature: Feature<Point> | null;
  onClose: () => void;
  isMobile: boolean;
}

export const Detail = ({ feature, onClose, isMobile }: DetailProps) => {
  const detailRef = useRef<SheetHandle>(null);

  const { t } = useTranslation();

  if (!feature) return null;

  const detail = (
    <div className="px-8 pb-3 rounded-bl-lg sm:pt-8 pb-26 flex flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode md:pb-8 w-full">
      <div className="hidden sm:block">
        <Row label={t("detail.location")} text={feature.properties?.["location"]} />
      </div>
      <h2 className="font-semibold sm:hidden h-12 flex items-center">
        {feature.properties?.["location"]}
      </h2>
    </div>
  );

  return (
    <MapDetail
      ref={detailRef}
      isBottomSheet={isMobile}
      onClose={onClose}
      isVisible={!!feature}
      bottomSheetSnapPoints={[84, "50%", "100%"]}
      bottomSheetInitialSnap={0}
    >
      {detail}
    </MapDetail>
  );
};

export default Detail;
