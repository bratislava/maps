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

export const Marker = ({ feature, onClick, isSelected }: IMarkerProps) => {
  const pieChartData = useMemo(
    () => [
      { x: "counseling", y: feature.properties?.counseling ? 1 : 0 },
      { x: "hygiene", y: feature.properties?.hygiene ? 1 : 0 },
      { x: "overnight", y: feature.properties?.overnight ? 1 : 0 },
      { x: "meals", y: feature.properties?.meals ? 1 : 0 },
      { x: "medicalTreatment", y: feature.properties?.medicalTreatment ? 1 : 0 },
      { x: "culture", y: feature.properties?.culture ? 1 : 0 },
    ],
    [feature],
  );

  return (
    <MapMarker onClick={onClick} feature={feature}>
      <div className="relative cursor-pointer w-6 h-6 rounded-full">
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
