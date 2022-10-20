import { IFilterResult } from "@bratislava/react-mapbox";
import { SearchBar } from "@bratislava/react-maps";
import { Funnel, X } from "@bratislava/react-maps-icons";
import cx from "classnames";
import {
  ActiveFilters,
  Divider,
  IActiveFilter,
  Select,
  SelectOption,
  Sidebar,
} from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "./SelectValueRenderer";

export interface IFiltersProps {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  areFiltersDefault: boolean;
  onResetFiltersClick: () => void;
  purposeFilter: IFilterResult<string>;
  districtFilter: IFilterResult<string>;
  occupancyFilter: IFilterResult<string>;
  isMobile?: boolean;
  activeFilters: IActiveFilter[];
}

export const Filters = ({
  isVisible,
  setVisible,
  areFiltersDefault,
  onResetFiltersClick,
  purposeFilter,
  districtFilter,
  occupancyFilter,
  isMobile = false,
  activeFilters,
}: IFiltersProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Sidebar
      position={isMobile ? "right" : "left"}
      isMobile={isMobile}
      isVisible={isVisible}
      setVisible={setVisible}
      title={t("title")}
      closeText={t("close")}
    >
      {!isMobile && (
        <div className="mx-6 hidden md:block relative">
          <SearchBar placeholder={t("search")} language={i18n.language} />
        </div>
      )}

      {isMobile && (
        <ActiveFilters
          areFiltersDefault={areFiltersDefault}
          activeFilters={activeFilters}
          onResetClick={onResetFiltersClick}
          title={t("activeFilters")}
          resetFiltersButtonText={t("resetFilters")}
        />
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-6 items-center">
          <div className="flex gap-2 items-center">
            {isMobile && <Funnel />}
            <h2 className="font-semibold text-md py-1">{t("filters.title")}</h2>
          </div>
          {!areFiltersDefault && (
            <button
              onClick={onResetFiltersClick}
              className="flex gap-2 items-center hover:underline"
            >
              <span className="font-semibold">{t("filters.reset")}</span>
              <X className="text-primary" />
            </button>
          )}
        </div>

        <div className={cx("w-full gap-4", { "px-6 grid grid-cols-2": !isMobile })}>
          <Select
            noBorder={isMobile}
            buttonClassName={isMobile ? "px-3" : ""}
            className={cx("w-full", { "col-span-2": !isMobile })}
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

          <Select
            noBorder={isMobile}
            className={cx("w-full", { "col-span-1": !isMobile })}
            buttonClassName={isMobile ? "px-3" : ""}
            value={purposeFilter.activeKeys}
            isMultiple
            onChange={(value) => purposeFilter.setActiveOnly(value ?? [])}
            onReset={() => purposeFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values}
                placeholder={t("filters.purpose.placeholder")}
                multiplePlaceholder={`${t("filters.district.multiplePurposes")} (${values.length})`}
              />
            )}
          >
            {purposeFilter.keys.map((purpose) => (
              <SelectOption key={purpose} value={purpose}>
                {purpose}
              </SelectOption>
            ))}
          </Select>

          <Select
            noBorder={isMobile}
            className={cx("w-full", { "col-span-1": !isMobile })}
            buttonClassName={isMobile ? "px-3" : ""}
            value={occupancyFilter.activeKeys}
            isMultiple
            onChange={(value) => occupancyFilter.setActiveOnly(value ?? [])}
            onReset={() => occupancyFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values}
                placeholder={t("filters.occupancy.placeholder")}
                multiplePlaceholder={`${t("filters.occupancy.multipleKinds")} (${values.length})`}
              />
            )}
          >
            {occupancyFilter.keys.map((occupancy) => (
              <SelectOption key={occupancy} value={occupancy}>
                {occupancy}
              </SelectOption>
            ))}
          </Select>
        </div>
      </div>

      {/* <TagFilter
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
      /> */}

      <Divider className="mx-6" />
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold px-6 text-md">{t("layersLabel")}</h2>
      </div>

      {/* <pre className="p-2 h-72 bg-black text-white overflow-auto">
        <code>{JSON.stringify(filters, null, 2)}</code>
      </pre> */}
    </Sidebar>
  );
};
