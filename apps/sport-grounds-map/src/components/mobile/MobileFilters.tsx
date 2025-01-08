import { IFilterResult } from "@bratislava/react-mapbox";
import { Funnel } from "@bratislava/react-maps-icons";
import {
  Divider,
  Select,
  IActiveFilter,
  ActiveFilters,
  SelectOption,
  Sidebar,
  Layers,
  ILayerGroup,
} from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IMobileFiltersProps {
  isVisible?: boolean;
  setVisible: (isVisible: boolean, changePrevious?: boolean) => void;
  areFiltersDefault: boolean;
  activeFilters: IActiveFilter[];
  onResetFiltersClick: () => void;
  districtFilter: IFilterResult<string>;
  layerFilter: IFilterResult<any>;
  layerGroups: ILayerGroup<string>[];
}

export const MobileFilters = ({
  isVisible,
  setVisible,
  areFiltersDefault,
  activeFilters,
  onResetFiltersClick,
  districtFilter,
  layerGroups,
  layerFilter,
}: IMobileFiltersProps) => {
  const { t } = useTranslation();

  return (
    <Sidebar
      isMobile
      title={t("title")}
      position="right"
      isVisible={isVisible ?? false}
      onClose={() => setVisible(false, false)}
      onOpen={() => setVisible(true, false)}
      closeText={t("close")}
    >
      <div>
        <ActiveFilters
          areFiltersDefault={areFiltersDefault}
          activeFilters={activeFilters}
          onResetClick={onResetFiltersClick}
          title={t("activeFilters")}
          resetFiltersButtonText={t("resetFilters")}
        />
      </div>

      <div>
        <div className="flex px-6 items-center">
          <div className="-ml-2">
            <Funnel />
          </div>
          <h2 className="font-bold text-md py-1">{t("filters.title")}</h2>
        </div>

        <div className="w-full flex flex-col">
          <Select
            noBorder
            className="w-full"
            buttonClassName="px-3"
            placeholder={t("filters.district.placeholder")}
            value={districtFilter.activeKeys}
            isMultiple
            onChange={(value) => districtFilter.setActiveOnly(value ?? [])}
            onReset={() => districtFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values}
                placeholder={t("filters.district.placeholder")}
                multiplePlaceholder={`${t("filters.district.multipleDistricts")} (${
                  values.length
                })`}
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
      </div>

      <Divider className="mx-6" />

      <h2 className="font-semibold text-md mx-6">{t("layers.title")}</h2>

      <Layers groups={layerGroups} onLayersVisibilityChange={layerFilter.setActive} />
    </Sidebar>
  );
};
