import { IFilterResult } from "@bratislava/mapbox-maps-core";
import { Chevron, Eye, EyeCrossed, Funnel, X } from "@bratislava/mapbox-maps-icons";
import {
  Divider,
  Select,
  TagFilter,
  IActiveFilter,
  ActiveFilters,
  SelectOption,
  Accordion,
  AccordionItem,
  Checkbox,
} from "@bratislava/mapbox-maps-ui";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IMobileFiltersProps<Y, D, S, T> {
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
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
}: IMobileFiltersProps<Y, D, S, T>) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        "fixed font-medium max-h-full top-0 left-0 bottom-0 w-full z-30 sm:hidden h-full pr-0 bg-background flex gap-6 flex-col transition-all duration-500 overflow-auto",
        { "translate-x-full shadow-lg": !isVisible },
      )}
    >
      <button
        onClick={() => setVisible(false)}
        className="flex items-center px-3 py-3 gap-2 bg-gray
        transition-all bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-10 active:bg-opacity-20"
      >
        <div className="flex p-2">
          <Chevron direction="left" className="text-primary" />
        </div>
        <h1 className="relative font-medium">{t("title")}</h1>
      </button>

      <div className="-mt-6">
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

      <div className="flex flex-col w-full">
        <Accordion>
          {typeCategories.map(({ label, types }, index) => {
            return (
              <AccordionItem
                isOpenable={types.length > 1}
                className={cx("border-l-4 transition-all bg-opacity-10", {
                  "bg-gray border-primary": typeFilter.isAnyKeyActive(types as T[]),
                  "border-transparent": !typeFilter.isAnyKeyActive(types as T[]),
                })}
                key={index}
                title={label}
                rightSlot={
                  <button
                    className="cursor-pointer p-1"
                    onClick={() =>
                      typeFilter.isAnyKeyActive(types as T[])
                        ? typeFilter.setActive(types as T[], false)
                        : typeFilter.setActive(types as T[], true)
                    }
                  >
                    {typeFilter.isAnyKeyActive(types as T[]) ? (
                      <Eye width={18} height={18} />
                    ) : (
                      <EyeCrossed width={18} height={18} />
                    )}
                  </button>
                }
              >
                {types.map((type) => {
                  return (
                    <Checkbox
                      key={type}
                      id={type}
                      label={type}
                      checked={typeFilter.areKeysActive(type as T)}
                      onChange={() => typeFilter.toggleActive(type as T)}
                    />
                  );
                })}
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="flex font-medium py-3 sticky top-full gap-2 justify-center items-center bg-gray transition-all bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-20 active:bg-opacity-30 hover:underline"
      >
        <span>{t("close")}</span>
        <X className="text-primary" />
      </button>
    </div>
  );
};
