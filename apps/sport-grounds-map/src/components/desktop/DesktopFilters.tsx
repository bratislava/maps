import { IFilterResult } from "@bratislava/react-mapbox";
import { SearchBar } from "@bratislava/react-maps";
import { X } from "@bratislava/react-maps-icons";
import {
  Divider,
  Select,
  SelectOption,
  Sidebar,
  Layers,
  ILayerGroup,
} from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IDesktopFiltersProps {
  isVisible?: boolean;
  setVisible: (isVisible: boolean) => void;
  areFiltersDefault: boolean;
  onResetFiltersClick: () => void;
  districtFilter: IFilterResult<string>;
  layerFilter: IFilterResult<any>;
  layerGroups: ILayerGroup<string>[];
}

export const DesktopFilters = ({
  isVisible,
  setVisible,
  areFiltersDefault,
  onResetFiltersClick,
  layerFilter,
  districtFilter,
  layerGroups,
}: IDesktopFiltersProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Sidebar
      position="left"
      isMobile={false}
      isVisible={isVisible ?? false}
      onClose={() => setVisible(false)}
      onOpen={() => setVisible(true)}
      title={t("title")}
      closeText={t("close")}
    >
      <div className="mx-6 relative">
        <SearchBar language={i18n.language} placeholder={t("search")} direction="bottom" />
      </div>

      <div className="flex justify-between px-6 items-center">
        <h2 className="font-semibold text-md py-1">{t("filters.title")}</h2>
        {!areFiltersDefault && (
          <button onClick={onResetFiltersClick} className="flex gap-2 items-center hover:underline">
            <span className="font-semibold">{t("filters.reset")}</span>
            <X className="text-primary" />
          </button>
        )}
      </div>

      <div className="w-full grid grid-cols-2 gap-4 px-6">
        <Select
          className="w-full"
          value={districtFilter.activeKeys}
          isMultiple
          onChange={(value) => districtFilter.setActiveOnly(value ?? [])}
          onReset={() => districtFilter.setActiveAll(false)}
          renderValue={({ values }) => (
            <SelectValueRenderer
              values={values}
              placeholder={t("filters.district.placeholder")}
              multiplePlaceholder={`${t("filters.district.multipleDistricts")} (${values.length})`}
            />
          )}
        >
          {districtFilter.keys.map((district) => (
            <SelectOption key={district} value={district}>
              {district}
            </SelectOption>
          ))}
        </Select>
      </div>

      <Divider className="mx-6" />

      <h2 className="font-semibold text-md mx-6">{t("layers.title")}</h2>

      <Layers groups={layerGroups} onLayersVisibilityChange={layerFilter.setActive} />
    </Sidebar>
  );
};
