import { useTranslation } from "react-i18next";

export type PopupProps = {
  name: string;
  terrainServices?: string[];
};

export const Popup = ({ name, terrainServices }: PopupProps) => {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-3">
      <div className="flex font-semibold text-[18px]">{name}</div>
      {terrainServices && (
        <div className="pt-4">
          <div className="pb-3 font-medium">{t("popup.terrainServices")}</div>
          {terrainServices?.map((terrainService, index) => (
            <div key={index}>{terrainService}</div>
          ))}
        </div>
      )}
    </div>
  );
};
