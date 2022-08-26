import { Slot } from "@bratislava/react-maps";
import cx from "classnames";
import { Feature } from "geojson";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Row } from "./Row";

export interface DetailProps {
  isMobile: boolean;
  feature: Feature | null;
}

export const Detail = ({ feature, isMobile }: DetailProps) => {
  const { t } = useTranslation();

  const [rows, setRows] = useState<{ label: string; text: any }[]>([]);

  useEffect(() => {
    setRows([]);
    if (feature) {
      setRows(
        Object.keys(feature["properties"] as any).map((label) => ({
          label,
          text: feature?.properties?.[label],
        })),
      );
    }
  }, [feature, setRows]);

  const detail = !feature ? null : (
    <>
      <div className="flex flex-col space-y-4 p-8 pt-4 overflow-auto max-h-screen">
        <div className="flex flex-col space-y-4">
          {rows.map(({ label, text }) => (
            <Row key={label} label={label} text={text} />
          ))}
        </div>
      </div>
      {/* <pre className="p-2 h-72 bg-black text-white overflow-auto">
        <code>{JSON.stringify(feature?.properties, null, 2)}</code>
      </pre> */}
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
    <Slot isVisible={!!feature} name="desktop-detail">
      <div
        className={cx(
          "fixed top-0 right-0 w-96 overflow-auto max-h-full bg-background-lightmode dark:bg-background-darkmode transition-all duration-500",
          {
            "translate-x-full": !feature,
            "shadow-lg": !!feature,
          },
        )}
      >
        {detail}
      </div>
    </Slot>
  );
};

export default Detail;
