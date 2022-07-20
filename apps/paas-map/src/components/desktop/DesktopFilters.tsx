import { IFilterResult, MapHandle } from "@bratislava/react-maps-core";
import { X } from "@bratislava/react-maps-icons";
import { Divider, Sidebar, Layers, ILayerGroup } from "@bratislava/react-maps-ui";
import mapboxgl from "mapbox-gl";
import { RefObject } from "react";
import { useTranslation } from "react-i18next";

export interface IDesktopFiltersProps<LF extends string, MF extends string> {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  areFiltersDefault: boolean;
  onResetFiltersClick: () => void;
  mapRef: RefObject<MapHandle>;
  mapboxgl: typeof mapboxgl;
  isGeolocation: boolean;
  layerFilter: IFilterResult<LF>;
  layerGroups: ILayerGroup<LF>[];
  markerFilter: IFilterResult<MF>;
  markerGroups: ILayerGroup<MF>[];
}

export const DesktopFilters = <LF extends string, MF extends string>({
  isVisible,
  setVisible,
  areFiltersDefault,
  onResetFiltersClick,
  layerFilter,
  layerGroups,
  markerFilter,
  markerGroups,
}: IDesktopFiltersProps<LF, MF>) => {
  const { t } = useTranslation();

  return (
    <Sidebar
      position="left"
      isMobile={false}
      isVisible={isVisible}
      setVisible={setVisible}
      title={t("title")}
    >
      <div className="mx-6 relative"></div>

      <div className="flex justify-between px-6 items-center">
        <h2 className="font-semibold text-md py-1">{t("filters.title")}</h2>
        {!areFiltersDefault && (
          <button onClick={onResetFiltersClick} className="flex gap-2 items-center hover:underline">
            <span className="font-semibold">{t("filters.reset")}</span>
            <X className="text-primary" />
          </button>
        )}
      </div>

      <Divider className="mx-6" />

      <Layers groups={layerGroups} onLayersVisibilityChange={layerFilter.setActive} />

      <Layers groups={markerGroups} onLayersVisibilityChange={markerFilter.setActive} />
    </Sidebar>
  );
};
