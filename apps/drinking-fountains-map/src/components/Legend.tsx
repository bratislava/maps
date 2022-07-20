import { useMemo } from "react";
import { processData } from "../utils/utils";
import { ReactComponent as Icon } from "../assets/marker-inactive.svg";
import { useTranslation } from "react-i18next";

export const Legend = () => {
  const { t } = useTranslation();
  const list = useMemo(() => {
    const { list } = processData();
    return list;
  }, []);
  return (
    <div className="py-4 sm:py-0 flex flex-col gap-4">
      <h2 className="px-6 text-md sm:hidden">{t("legend.title")}</h2>
      <div className="grid gap-x-6 sm:grid-cols-2">
        {list.map((item) => {
          return (
            <div key={item} className="flex gap-2 items-center px-6 sm:px-0 py-2">
              <Icon className="shrink-0" />
              <div className="text-[14px] font-light">{item}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
