import { IFilterResult } from "@bratislava/react-mapbox";
import { SearchBar, Slot } from "@bratislava/react-maps";
import { Funnel, X } from "@bratislava/react-maps-icons";
import {
  ActiveFilters,
  DateRangePickerFixed,
  Divider,
  IActiveFilter,
  Select,
  SelectOption,
  Sidebar,
  TagFilter,
} from "@bratislava/react-maps-ui";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { Layers } from "./Layers";
import { SelectValueRenderer } from "./SelectValueRenderer";
import { DateValue } from "@react-types/calendar";

export interface IFiltersProps {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  isMobile?: boolean;
  areFiltersDefault: boolean;
  activeFilters: IActiveFilter[];
  onResetFiltersClick: () => void;
  districtFilter: IFilterResult<string>;
  layerFilter: IFilterResult<string>;
  typeFilter: IFilterResult<string>;
  statusFilter: IFilterResult<string>;
  dateStart?: DateValue;
  dateEnd?: DateValue;
  onDateStartChange: (date?: DateValue) => void;
  onDateEndChange: (date?: DateValue) => void;
}

export const Filters = ({
  isVisible,
  setVisible,
  areFiltersDefault,
  activeFilters,
  onResetFiltersClick,
  districtFilter,
  layerFilter,
  isMobile,
  statusFilter,
  typeFilter,
  dateStart,
  dateEnd,
  onDateStartChange,
  onDateEndChange,
}: IFiltersProps) => {
  const { t, i18n }: { t: (key: string) => string; i18n: { language: string } } = useTranslation();

  const content = (
    <>
      {isMobile && (
        <div>
          <ActiveFilters
            areFiltersDefault={areFiltersDefault}
            activeFilters={activeFilters}
            onResetClick={onResetFiltersClick}
            title={t("activeFilters")}
            resetFiltersButtonText={t("resetFilters")}
          />
        </div>
      )}

      {!isMobile && (
        <div className="mx-6 hidden md:block relative">
          <SearchBar placeholder={t("search")} language={i18n.language} />
        </div>
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

        <div
          className={cx("w-full flex flex-col gap-4", {
            "px-6": !isMobile,
          })}
        >
          <Select
            noBorder={isMobile}
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

          <Select
            noBorder={isMobile}
            className="w-full"
            buttonClassName="px-3"
            placeholder={t("filters.type.placeholder")}
            value={typeFilter.activeKeys}
            isMultiple
            onChange={(value) => typeFilter.setActiveOnly(value ?? [])}
            onReset={() => typeFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values.map((v) => t(`filters.type.types.${v}`))}
                placeholder={t("filters.type.placeholder")}
                multiplePlaceholder={`${t("filters.type.multipleTypes")} (${values.length})`}
              />
            )}
          >
            {typeFilter.keys.map((type) => (
              <SelectOption key={type} value={type}>
                {t(`filters.type.types.${type}`)}
              </SelectOption>
            ))}
          </Select>
        </div>

        <TagFilter
          title={t("filters.status.title")}
          values={statusFilter.values
            .map((status) => ({
              key: status.key,
              label: t(`filters.status.${status.key}`),
              isActive: status.isActive,
            }))
           }
          onTagClick={(status: string) => statusFilter.toggleActive(status)}
        />

        <div className="mx-6 flex flex-col gap-2">
          <div>Dátum</div>
          <DateRangePickerFixed
            label="Date range"
            value={dateStart && dateEnd ? { start: dateStart, end: dateEnd } : undefined}
            onChange={(e) => {
              onDateStartChange(e.start);
              onDateEndChange(e.end);
            }}
            onResetClick={() => {
              onDateStartChange(undefined);
              onDateEndChange(undefined);
            }}
          />
        </div>
      </div>

      <Divider className="mx-6" />

      <h2 className="font-semibold px-6 text-md">{t("layers.title")}</h2>

      <Layers isMobile={isMobile ?? false} filter={layerFilter} />
    </>
  );

  return isMobile ? (
    <Slot id="mobile-filters" isVisible={isVisible} position="top-right">
      <Sidebar
        position="right"
        isMobile
        isVisible={isVisible ?? false}
        onOpen={() => setVisible(true)}
        onClose={() => setVisible(false)}
        title={t("title")}
        closeText={t("close")}
      >
        {content}
      </Sidebar>
    </Slot>
  ) : (
    <Slot
      position="top-left"
      autoPadding
      avoidMapboxControls
      id="desktop-filters"
      isVisible={isVisible}
    >
      <Sidebar
        isMobile={false}
        position="left"
        isVisible={isVisible ?? false}
        onOpen={() => setVisible(true)}
        onClose={() => setVisible(false)}
        title={t("title")}
        closeText={t("close")}
      >
        {content}
      </Sidebar>
    </Slot>
  );
};
