import { Marker as MapMarker } from "@bratislava/react-mapbox";
import { Feature, Point } from "geojson";
import { useMemo } from "react";
import { VictoryPie } from "victory";
import cx from "classnames";
import { colors } from "../utils/colors";

export interface IMarkerProps {
  feature: Feature<Point>;
  onClick: () => void;
  isSelected: boolean;
  activeKeys: string[];
}

const PieChart = ({
  data,
  innerRadius = 0,
}: {
  data: {
    x: string;
    y: number;
  }[];
  innerRadius?: number;
}) => (
  <div className="w-full h-full overflow-hidden rounded-full">
    <div className="-m-[10px]">
      <VictoryPie
        labels={[]}
        colorScale={Object.keys(colors).map((key) => colors[key])}
        innerRadius={innerRadius}
        data={data}
      />
    </div>
  </div>
);

export const Marker = ({ feature, onClick, isSelected, activeKeys }: IMarkerProps) => {
  const pieChartData = useMemo(
    () => [
      {
        x: "counseling",
        y: feature.properties?.isCounseling && activeKeys.includes("counseling") ? 1 : 0,
      },
      {
        x: "hygiene",
        y: feature.properties?.isHygiene && activeKeys.includes("hygiene") ? 1 : 0,
      },
      {
        x: "overnight",
        y: feature.properties?.isOvernight && activeKeys.includes("overnight") ? 1 : 0,
      },
      { x: "meals", y: feature.properties?.isMeals && activeKeys.includes("meals") ? 1 : 0 },
      {
        x: "medicalTreatment",
        y:
          feature.properties?.isMedicalTreatment && activeKeys.includes("medicalTreatment") ? 1 : 0,
      },
      {
        x: "culture",
        y: feature.properties?.isCulture && activeKeys.includes("culture") ? 1 : 0,
      },
      {
        x: "drugsAndSex",
        y: feature.properties?.isDrugsAndSex && activeKeys.includes("drugsAndSex") ? 1 : 0,
      },
      { x: "kolo", y: feature.properties?.isKolo && activeKeys.includes("kolo") ? 1 : 0 },
      {
        x: "notaBene",
        y: feature.properties?.isNotaBene && activeKeys.includes("notaBene") ? 1 : 0,
      },
    ],
    [feature, activeKeys],
  );

  return (
    <MapMarker zIndex={2} onClick={onClick} feature={feature}>
      <div className="relative cursor-pointer w-8 h-8 rounded-full">
        <div
          className={cx(
            "w-[calc(100%-2px)] h-[calc(100%-2px)] m-[1px] absolute -z-20 rounded-full bg-[#333333]",
          )}
        ></div>
        <div className={cx("absolute -z-10 w-full h-full")}>
          <PieChart data={pieChartData} />
        </div>
        <div className="p-1 flex z-20 relative h-full">
          <div
            className={cx("w-full h-full rounded-full", {
              "bg-white": isSelected,
              "bg-[#333333]": !isSelected,
            })}
          ></div>
        </div>
      </div>
    </MapMarker>
  );
};
