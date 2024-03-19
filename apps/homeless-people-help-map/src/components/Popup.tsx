import { useTranslation } from "react-i18next";

export type PopupProps = {
  name: string;
  terrainServices?: string[];
};

export const Popup = ({ name, terrainServices }: PopupProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex font-semibold text-[18px]">{name}</div>
      {terrainServices && (
        <div className="py-4">
          <div className="pb-3">{t("popup.terrainServices")}</div>
          {terrainServices?.map((terrainService, index) => (
            <div key={index}>{terrainService}</div>
          ))}
        </div>
      )}
    </div>
  );
};
