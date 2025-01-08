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
} from "@bratislava/react-maps-ui";
import { DateValue } from "@react-types/calendar";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { ITooltip } from "./App";
import { Layers } from "./Layers";
import { SelectValueRenderer } from "./SelectValueRenderer";
import { TagFilter } from "./TagFilter";

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
  modalHandler: (arg1: ITooltip | null) => void;
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
  modalHandler,
}: IFiltersProps) => {
  const { t, i18n } = useTranslation();

  const statusTagHandler = (status: string) => {
    const activeStatusKeys = statusFilter.activeKeys;
    if (activeStatusKeys.length === 1 && activeStatusKeys.includes(status)) return;
    statusFilter.toggleActive(status);
  };

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
            <h2 className="font-semibold text-md py-1 text-headers dark:text-[white]">
              {t("filters.title")}
            </h2>
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
                // https://www.i18next.com/overview/typescript#type-error-template-literal
                values={values.map((v) => t(`filters.type.types.${v}` as any))}
                placeholder={t("filters.type.placeholder")}
                multiplePlaceholder={`${t("filters.type.multipleTypes")} (${values.length})`}
              />
            )}
          >
            {typeFilter.keys
              .sort((a, b) => (a === "Iné" ? 1 : b === "Iné" ? -1 : a.localeCompare(b)))
              .map((type) => (
                <SelectOption key={type} value={type}>
                  {/* https://www.i18next.com/overview/typescript#type-error-template-literal */}
                  {t(`filters.type.types.${type}` as any)}
                </SelectOption>
              ))}
          </Select>
        </div>

        <TagFilter
          isMobile={isMobile}
          modalHandler={modalHandler}
          title={t("filters.status.title")}
          values={statusFilter.values.map((status) => ({
            key: status.key,
            // https://www.i18next.com/overview/typescript#type-error-template-literal
            label: t(`filters.status.${status.key}` as any),
            isActive: status.isActive,
          }))}
          onTagClick={(status: string) => statusTagHandler(status)}
        />

        <div className="mx-6 flex flex-col gap-2">
          <div>{t("filters.date")}</div>
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

      <h2 className="font-semibold px-6 text-md text-headers dark:text-[white]">
        {t("layers.title")}
      </h2>

      <Layers filter={layerFilter} />
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
