import cx from "classnames";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "@bratislava/react-maps-ui";
import {
  CONIFER_COLOR,
  DECIDUOUS_COLOR,
  DISTRICT_COLOR,
  DISTRICT_OPACITY,
  treeKindColorMappingObject,
} from "../utils/utils";

interface ILegendItem {
  label: string;
  type: "circle" | "line";
  color: string;
  opacity?: number;
}

export const Legend = () => {
  const { t }: { t: (key: string) => string } = useTranslation();

  const specificColors: ILegendItem[] = useMemo(
    () => [
      ...Object.keys(treeKindColorMappingObject).map(
        (key) =>
          ({
            label: t(`trees.${key}`),
            type: "circle",
            color: treeKindColorMappingObject[key],
          } as const),
      ),
    ],
    [t],
  );

  const otherColors: ILegendItem[] = useMemo(
    () => [
      {
        label: t("legend.districtBorder"),
        type: "line",
        color: DISTRICT_COLOR,
        opacity: DISTRICT_OPACITY,
      },
      {
        label: t("legend.decidiousTrees"),
        type: "circle",
        color: DECIDUOUS_COLOR,
      },
      {
        label: t("legend.coniferTrees"),
        type: "circle",
        color: CONIFER_COLOR,
      },
    ],
    [t],
  );

  return (
    <div className="py-4 sm:py-0 flex flex-col gap-4">
      <div className="grid gap-x-6 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {specificColors.map(({ label, type, color, opacity }) => {
          return (
            <div key={label} className="flex gap-2 items-center px-6 sm:px-0 py-2">
              <div
                className={cx({
                  "w-4 h-4 rounded-full": type === "circle",
                  "w-4 h-1 rounded-lg": type === "line",
                })}
                style={{
                  backgroundColor: color,
                  opacity,
                }}
              ></div>
              <div className="text-[14px]">{label}</div>
            </div>
          );
        })}
      </div>
      <Divider className="mx-6 sm:mx-0" />
      <div className="grid gap-x-6 md:grid-cols-3">
        {otherColors.map(({ label, type, color, opacity }) => {
          return (
            <div key={label} className="flex gap-2 items-center px-6 sm:px-0 py-2">
              <div
                className={cx({
                  "w-4 h-4 rounded-full": type === "circle",
                  "w-4 h-1 rounded-lg": type === "line",
                })}
                style={{
                  backgroundColor: color,
                  opacity,
                }}
              ></div>
              <div className="text-[14px]">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
