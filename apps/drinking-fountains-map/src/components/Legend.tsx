import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as Icon } from "../assets/marker-inactive.svg";
import { processData } from "../utils/utils";

export const Legend = () => {
  const { t } = useTranslation();
  const list = useMemo(() => {
    const { list } = processData();
    return list;
  }, []);
  return (
    <div className="py-4 sm:py-0 flex flex-col gap-4">
      <h2 className="px-6 text-md sm:hidden">{t("legend.title")}</h2>
      <div className="grid gap-x-6 sm:grid-cols-2 sm:grid-rows-[_repeat(11,_auto)] sm:grid-flow-col">
        {list.map((item) => {
          return (
            <div
              key={item}
              className="flex gap-2 items-center px-6 sm:px-0 py-2 w-full max-w-[256px]"
            >
              <Icon className="dark shrink-0" />
              <div className="text-[14px] font-light">{item}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
