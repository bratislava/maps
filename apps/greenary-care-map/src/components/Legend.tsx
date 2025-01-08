import cx from "classnames";
import { useTranslation } from "react-i18next";

export interface ILegendProps {
  mapCircleColors: { [index: string]: string | string[] };
}

export const Legend = ({ mapCircleColors }: ILegendProps) => {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-0">
      {Object.keys(mapCircleColors).map((type) => {
        const color = (
          Array.isArray(mapCircleColors[type]) ? mapCircleColors[type][0] : mapCircleColors[type]
        ) as string;
        return (
          <div key={type} className="flex gap-2 items-center py-2">
            <div
              className={cx({
                "w-4 h-4 rounded-full": type !== "districtBorder",
                "w-4 h-1 rounded-lg": type === "districtBorder",
              })}
              style={{
                backgroundColor: color,
              }}
            ></div>
            {type === "districtBorder" ? (
              <div className="text-[14px]">{t("districtBorder")}</div>
            ) : (
              // https://www.i18next.com/overview/typescript#type-error-template-literal
              <div className="text-[14px]">{t(`categories.${type}` as any)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};
