import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import { LayerButton } from "./LayerButton";

const COLOR = colors.terrainServices;

export type TerrainServicesProps = {
  services: {
    key: string;
    title: string;
  }[];
  activeServiceKey: string | null;
  onServiceClick: (key: string) => void;
};

export const TerrainServices = ({
  services,
  activeServiceKey,
  onServiceClick,
}: TerrainServicesProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold px-6 text-md">{t("terrainServices.title")}</h2>

      <div>
        {services.map(({ title, key }) => (
          <LayerButton
            color={COLOR}
            key={key}
            isVisible={activeServiceKey === key}
            title={title}
            onClick={() => onServiceClick(key)}
          />
        ))}
      </div>
    </div>
  );
};
