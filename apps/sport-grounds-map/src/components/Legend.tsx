import { icons } from "./Icon";
import { useTranslation } from "react-i18next";

export const Legend = () => {
  const { t: tagsT } = useTranslation("translation", { keyPrefix: "filters.tag.tags" });
  const { t } = useTranslation("translation");
  return (
    <div className="flex flex-col gap-6">
      <div className="font-bold text-md">{t("legend")}</div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
        {icons.map(({ component: Icon, name }) => (
          <div className="flex gap-2 items-center" key={name}>
            <div className="w-12 h-12 bg-primary rounded-full text-white">
              <Icon className="w-14 h-14 -m-1" />
            </div>
            <div className="first-letter:uppercase">{tagsT(name)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
