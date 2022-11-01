import { IFilterResult } from "@bratislava/react-mapbox";
import { SearchBar } from "@bratislava/react-maps";
import { Funnel, X } from "@bratislava/react-maps-icons";
import cx from "classnames";
import {
  ActiveFilters,
  IActiveFilter,
  Select,
  SelectOption,
  Sidebar,
  Slider,
} from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "./SelectValueRenderer";
import { useMemo } from "react";

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

  minArea: number;
  maxArea: number;
  minPrice: number;
  maxPrice: number;
  onAreaChange: (minMax: [number, number]) => void;
  onAreaChangeEnd: (minMax: [number, number]) => void;
  onPriceChange: (minMax: [number, number]) => void;
  onPriceChangeEnd: (minMax: [number, number]) => void;
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
  minArea,
  maxArea,
  minPrice,
  maxPrice,
  onAreaChange,
  onAreaChangeEnd,
  onPriceChange,
  onPriceChangeEnd,
}: IFiltersProps) => {
  const { t, i18n } = useTranslation();

  const priceSliderValue = useMemo(() => [minPrice, maxPrice], [minPrice, maxPrice]);
  const areaSliderValue = useMemo(() => [minArea, maxArea], [minArea, maxArea]);

  return (
    <Sidebar
      position={isMobile ? "right" : "left"}
      isMobile={isMobile}
      isVisible={isVisible}
      onClose={() => setVisible(false)}
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

      <div className="flex flex-col gap-4">
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
          <div className={cx("w-full flex flex-col gap-2", { "col-span-2": !isMobile })}>
            <Select
              noBorder={isMobile}
              buttonClassName={isMobile ? "px-3" : ""}
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

          <div className={cx("w-full flex flex-col gap-2", { "col-span-1": !isMobile })}>
            <Select
              noBorder={isMobile}
              buttonClassName={isMobile ? "px-3" : ""}
              value={purposeFilter.activeKeys}
              isMultiple
              onChange={(value) => purposeFilter.setActiveOnly(value ?? [])}
              onReset={() => purposeFilter.setActiveAll(false)}
              renderValue={({ values }) => (
                <SelectValueRenderer
                  values={values}
                  placeholder={t("filters.purpose.placeholder")}
                  multiplePlaceholder={`${t("filters.purpose.multiplePurposes")} (${
                    values.length
                  })`}
                />
              )}
            >
              {purposeFilter.keys.map((purpose) => (
                <SelectOption key={purpose} value={purpose}>
                  {purpose}
                </SelectOption>
              ))}
            </Select>
          </div>

          <div className={cx("w-full flex flex-col gap-2", { "col-span-1": !isMobile })}>
            <Select
              noBorder={isMobile}
              buttonClassName={isMobile ? "px-3" : ""}
              value={occupancyFilter.activeKeys}
              isMultiple
              onChange={(value) => occupancyFilter.setActiveOnly(value ?? [])}
              onReset={() => occupancyFilter.setActiveAll(false)}
              renderValue={({ values }) => (
                <SelectValueRenderer
                  values={values.map((value) =>
                    t(`filters.occupancy.types.${value as "free" | "occupied"}`),
                  )}
                  placeholder={t("filters.occupancy.placeholder")}
                  multiplePlaceholder={`${t("filters.occupancy.multipleOccupancies")} (${
                    values.length
                  })`}
                />
              )}
            >
              {occupancyFilter.keys.map((occupancy) => (
                <SelectOption key={occupancy} value={occupancy}>
                  {t(`filters.occupancy.types.${occupancy as "free" | "occupied"}`)}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>

        <div className="px-6 flex flex-col gap-4">
          <Slider
            label={t("filters.area.title")}
            minValue={0}
            maxValue={15_000}
            unit={
              <span>
                m<sup className="text-xs font-bold">2</sup>
              </span>
            }
            step={100}
            onChange={(a) => Array.isArray(a) && onAreaChange(a as [number, number])}
            onChangeEnd={(a) => Array.isArray(a) && onAreaChangeEnd(a as [number, number])}
            value={areaSliderValue}
          />

          <Slider
            label={t("filters.price.title")}
            minValue={0}
            maxValue={100_000}
            unit="€"
            step={1000}
            onChange={(p) => Array.isArray(p) && onPriceChange(p as [number, number])}
            onChangeEnd={(p) => Array.isArray(p) && onPriceChangeEnd(p as [number, number])}
            value={priceSliderValue}
          />
        </div>
      </div>
    </Sidebar>
  );
};
