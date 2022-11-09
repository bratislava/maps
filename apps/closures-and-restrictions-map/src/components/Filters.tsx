import { IFilterResult } from "@bratislava/react-mapbox";
import { MapHandle, SearchBar, Slot } from "@bratislava/react-maps";
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
import cx from "classnames";
import { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { ILayerCategory, Layers } from "./Layers";
import { SelectValueRenderer } from "./SelectValueRenderer";

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
  layerCategories: ILayerCategory[];
  isGeolocation: boolean;
  mapRef: RefObject<MapHandle>;
}

export const Filters = ({
  isVisible,
  setVisible,
  areFiltersDefault,
  activeFilters,
  onResetFiltersClick,
  districtFilter,
  layerCategories,
  layerFilter,
  isMobile,
  statusFilter,
  typeFilter,
}: IFiltersProps) => {
  const { t, i18n } = useTranslation();

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
        <div className="flex px-6 items-center">
          {isMobile && (
            <div className="-ml-2">
              <Funnel />
            </div>
          )}
          <h2 className="font-bold text-md py-1">{t("filters.title")}</h2>
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
            // This another tag button is for testing purposes only, // TODO: remove it
            .concat([
              {
                key: "all",
                label: "všetky",
                isActive: statusFilter.activeKeys.length === 3,
              },
            ])}
          onTagClick={(status) => {
            if (status === "all") {
              if (statusFilter.activeKeys.length !== 3) {
                statusFilter.setActiveAll(true);
              }
              return;
            }

            if (statusFilter.activeKeys.length === 3) {
              statusFilter.setActiveOnly(status);
              return;
            }

            if (!(statusFilter.activeKeys.length === 1 && statusFilter.activeKeys[0] === status)) {
              statusFilter.toggleActive(status);
            }
          }}
        />
      </div>

      <Divider className="mx-6" />

      <h2 className="font-semibold px-6 text-md">{t("layers.title")}</h2>

      <Layers isMobile={isMobile ?? false} filter={layerFilter} layers={layerCategories} />
    </>
  );

  return isMobile ? (
    <Slot id="mobile-filters" isVisible={isVisible}>
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
