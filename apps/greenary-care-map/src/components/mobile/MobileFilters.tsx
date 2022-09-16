import { IFilterResult } from "@bratislava/react-mapbox";
import { Funnel } from "@bratislava/react-maps-icons";
import {
  ActiveFilters,
  Divider,
  IActiveFilter,
  Select,
  SelectOption,
  Sidebar,
  TagFilter,
} from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { Layers } from "../Layers";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IMobileFiltersProps<Y, D, S, T> {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  areFiltersDefault: boolean;
  activeFilters: IActiveFilter[];
  onResetFiltersClick: () => void;
  yearFilter: IFilterResult<Y>;
  districtFilter: IFilterResult<D>;
  seasonFilter: IFilterResult<S>;
  typeFilter: IFilterResult<T>;
  typeCategories: {
    label: string;
    types: string[];
  }[];
  typeTooltips: {
    [index: string]: string;
  };
}

export const MobileFilters = <
  Y extends string,
  D extends string,
  S extends string,
  T extends string,
>({
  isVisible,
  setVisible,
  areFiltersDefault,
  activeFilters,
  onResetFiltersClick,
  yearFilter,
  districtFilter,
  seasonFilter,
  typeFilter,
  typeCategories,
  typeTooltips,
}: IMobileFiltersProps<Y, D, S, T>) => {
  const { t } = useTranslation();

  return (
    <Sidebar
      position="right"
      isMobile
      isVisible={isVisible}
      setVisible={setVisible}
      title={t("title")}
    >
      <div className="">
        <ActiveFilters
          areFiltersDefault={areFiltersDefault}
          activeFilters={activeFilters}
          onResetClick={onResetFiltersClick}
          title={t("activeFilters")}
          resetFiltersButtonText={t("resetFilters")}
        />
      </div>

      <div>
        <div className="flex px-6 gap-2 items-center">
          <div className="-ml-2">
            <Funnel size="lg" />
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
            onChange={(value) => districtFilter.setActiveOnly((value ?? []) as D[])}
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

          <Select
            noBorder
            className="w-full"
            buttonClassName="px-3"
            placeholder={t("filters.year.placeholder")}
            value={yearFilter.activeKeys}
            isMultiple
            onChange={(value) => yearFilter.setActiveOnly((value ?? []) as Y[])}
            onReset={() => yearFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values}
                placeholder={t("filters.year.placeholder")}
                multiplePlaceholder={`${t("filters.year.multipleYears")} (${values.length})`}
              />
            )}
          >
            {yearFilter.keys.map((year) => (
              <SelectOption key={year} value={year}>
                {year}
              </SelectOption>
            ))}
          </Select>
        </div>

        <div className="mt-3">
          <TagFilter
            title={t("filters.season.title")}
            values={seasonFilter.values.map((season) => ({
              key: season.key,
              label: t(`filters.season.seasons.${season.key}`),
              isActive: season.isActive,
            }))}
            onTagClick={(season) => {
              if (seasonFilter.activeKeys.length == 4) {
                seasonFilter.setActiveOnly(season);
              } else if (
                !(seasonFilter.activeKeys.length == 1 && seasonFilter.activeKeys[0] == season)
              ) {
                seasonFilter.toggleActive(season);
              }
            }}
          />
        </div>
      </div>

      <Divider className="mx-6" />

      <h2 className="font-bold px-6 text-md">{t("layersLabel")}</h2>

      <Layers
        isMobile
        typeFilter={typeFilter}
        typeTooltips={typeTooltips}
        typeCategories={typeCategories}
      />
    </Sidebar>
  );
};
