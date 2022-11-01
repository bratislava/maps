import cx from "classnames";
import { useTranslation } from "react-i18next";

export type LegendItem = {
  title: string;
  color: string;
  type?: "line" | "circle";
};

export interface ILegendProps {
  items: LegendItem[];
}

export const Legend = ({ items }: ILegendProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "legend" });
  return (
    <div className="flex flex-col gap-4">
      <div className="font-semibold text-md">{t("title")}</div>
      <div className="flex flex-col gap-2">
        {items.map(({ title, color, type = "circle" }) => {
          return (
            <div key={title} className="flex gap-2 items-center">
              <div
                className={cx("rounded-full", {
                  "w-4 h-4": type === "circle",
                  "w-4 h-1": type === "line",
                })}
                style={{
                  backgroundColor: color,
                }}
              />
              <div className="text-[14px]">{title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
