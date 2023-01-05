import { VictoryPie } from "victory";
import { Feature } from "geojson";
import cx from "classnames";
import { colors } from "../../utils/colors";
import { useMemo } from "react";

export interface IMultiFeatureMarkerProps {
  features: Feature[];
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
        colorScale={[colors.forRent, colors.occupied, colors.free]}
        innerRadius={innerRadius}
        data={data}
      />
    </div>
  </div>
);

export const MultiFeatureMarker = ({ features, isSelected }: IMultiFeatureMarkerProps) => {
  const pieChartData = useMemo(
    () =>
      features.reduce(
        (prev, feature) => {
          if (feature.properties?.occupancy === "forRent") {
            return [{ x: "forRent", y: prev[0].y + 1 }, prev[1], prev[2]];
          }
          if (feature.properties?.occupancy === "occupied") {
            return [prev[0], { x: "occupied", y: prev[1].y + 1 }, prev[2]];
          }
          return [prev[0], prev[1], { x: "free", y: prev[2].y + 1 }];
        },
        [
          { x: "forRent", y: 0 },
          { x: "occupied", y: 0 },
          { x: "free", y: 0 },
        ],
      ) ?? [],
    [features],
  );

  return (
    <div className="relative cursor-pointer w-10 h-10">
      <div className={cx("absolute -z-10 w-full h-full")}>
        <PieChart data={pieChartData} />
      </div>
      {isSelected && (
        <div className={cx("absolute -z-10 -m-[4px]")}>
          <PieChart data={pieChartData} innerRadius={130} />
        </div>
      )}
      <div className="text-white font-semibold text-[16px] w-full h-full flex items-center justify-center z-20">
        {features.length}
      </div>
    </div>
  );
};
