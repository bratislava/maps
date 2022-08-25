import { X } from "@bratislava/react-maps-icons";
import { Feature, Point } from "geojson";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import { Row } from "./Row";

export interface DetailProps {
  feature: Feature<Point> | null;
  onClose: () => void;
  isMobile: boolean;
}

export const Detail = ({ feature, onClose, isMobile }: DetailProps) => {
  const sheetRef = useRef<BottomSheetRef>(null);

  const { t } = useTranslation();

  if (!feature) return null;

  const detail = (
    <div className="px-8 pb-3 rounded-bl-lg sm:pt-8 pb-26 flex flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode md:pb-8 w-full">
      <button className="hidden sm:block absolute right-4 top-8 p-2" onClick={onClose}>
        <X />
      </button>
      <div className="hidden sm:block">
        <Row label={t("detail.location")} text={feature.properties?.["location"]} />
      </div>
      <h2 className="font-semibold sm:hidden h-12 flex items-center">
        {feature.properties?.["location"]}
      </h2>
    </div>
  );

  return isMobile ? (
    <BottomSheet
      ref={sheetRef}
      snapPoints={() => [88]}
      blocking={false}
      className="relative z-30"
      open={true}
    >
      {detail}
    </BottomSheet>
  ) : (
    detail
  );
};

export default Detail;
