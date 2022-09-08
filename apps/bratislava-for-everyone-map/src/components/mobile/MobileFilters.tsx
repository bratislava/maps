import { IFilterResult } from "@bratislava/react-mapbox";
import { Funnel } from "@bratislava/react-maps-icons";
import {
  ActiveFilters,
  Divider,
  IActiveFilter,
  Select,
  SelectOption,
  Sidebar,
} from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IMobileFiltersProps {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  areFiltersDefault: boolean;
  activeFilters: IActiveFilter[];
  onResetFiltersClick: () => void;
  districtFilter: IFilterResult<string>;
}

export const MobileFilters = ({
  isVisible,
  setVisible,
  areFiltersDefault,
  activeFilters,
  onResetFiltersClick,
  districtFilter,
}: IMobileFiltersProps) => {
  const { t } = useTranslation();

  return (
    <Sidebar
      position="right"
      isMobile
      isVisible={isVisible}
      setVisible={setVisible}
      title={t("title")}
    >
      <div>
        <ActiveFilters
          areFiltersDefault={areFiltersDefault}
          activeFilters={activeFilters}
          onResetClick={onResetFiltersClick}
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

        {/* <div className="mt-3">
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
        </div> */}
      </div>

      <Divider className="mx-6" />

      <h2 className="font-semibold px-6 text-md">{t("layersLabel")}</h2>
    </Sidebar>
  );
};
