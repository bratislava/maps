import { IFilterResult } from "@bratislava/react-mapbox";
import { Sidebar } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { Layers } from "./Layers";

export interface IFiltersProps {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  layerFilter: IFilterResult<string>;
  markerFilter: IFilterResult<string>;
  isMobile: boolean;
}

export const Filters = ({
  isVisible,
  setVisible,
  layerFilter,
  markerFilter,
  isMobile,
}: IFiltersProps) => {
  const { t } = useTranslation();

  return (
    <Sidebar
      position={isMobile ? "right" : "left"}
      isMobile={isMobile}
      isVisible={isVisible ?? false}
      onClose={() => setVisible(false)}
      onOpen={() => setVisible(true)}
      title={t("title")}
      closeText={t("close")}
    >
      <div className=" flex flex-col gap-4">
        <div className="flex  justify-between px-6 items-center">
          <h2 className="font-semibold text-md py-1">{t("layers.title")}</h2>
        </div>

        <Layers isMobile={isMobile} layerFilter={layerFilter} markerFilter={markerFilter} />
      </div>
    </Sidebar>
  );
};
