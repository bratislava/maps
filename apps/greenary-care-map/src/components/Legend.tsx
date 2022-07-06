import cx from "classnames";

export interface ILegendProps {
  mapCircleColors: { [index: string]: string | string[] };
}

export const Legend = ({ mapCircleColors }: ILegendProps) => {
  return (
    <div className="py-4">
      {Object.keys(mapCircleColors).map((type) => {
        const color = (
          Array.isArray(mapCircleColors[type]) ? mapCircleColors[type][0] : mapCircleColors[type]
        ) as string;
        return (
          <div key={type} className="flex gap-2 items-center px-6 py-2">
            <div
              className={cx({
                "w-4 h-4 rounded-full": type !== "hranica mestskej časti",
                "w-4 h-1 rounded-lg": type === "hranica mestskej časti",
              })}
              style={{
                backgroundColor: color,
              }}
            ></div>
            <div className="text-sm">{type}</div>
          </div>
        );
      })}
    </div>
  );
};
