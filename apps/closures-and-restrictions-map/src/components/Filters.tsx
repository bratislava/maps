import { IFilterResult } from "@bratislava/react-mapbox";
import { forwardGeocode, GeocodeFeature, MapHandle, Slot } from "@bratislava/react-maps";
import { Funnel } from "@bratislava/react-maps-icons";
import {
  ActiveFilters,
  Divider,
  IActiveFilter,
  SearchBar,
  Select,
  SelectOption,
  Sidebar,
  TagFilter,
} from "@bratislava/react-maps-ui";
import cx from "classnames";
import mapboxgl from "mapbox-gl";
import { RefObject, useCallback, useState } from "react";
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
  mapboxgl: typeof mapboxgl;
  layerFilter: IFilterResult<string>;
  typeFilter: IFilterResult<string>;
  statusFilter: IFilterResult<"planned" | "active" | "done">;
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
  isGeolocation,
  layerCategories,
  layerFilter,
  mapboxgl,
  isMobile,
  mapRef,
  statusFilter,
  typeFilter,
}: IFiltersProps) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFeatures, setSearchFeatures] = useState<GeocodeFeature[]>([]);

  const onSearchFeatureClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any) => {
      setSearchQuery(feature.place_name_sk.split(",")[0]);
      setSearchFeatures([]);
      if (feature.geometry.type === "Point") {
        mapRef.current?.changeViewport({
          center: {
            lng: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
          },
          zoom: 17,
        });
      }
    },
    [mapRef],
  );

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
        <div className="mx-6 relative">
          <SearchBar
            value={searchQuery}
            placeholder={t("search")}
            onFocus={(e) => {
              forwardGeocode(mapboxgl, e.target.value).then((results) =>
                setSearchFeatures(results),
              );
            }}
            onBlur={() => setSearchFeatures([])}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              forwardGeocode(mapboxgl, e.target.value).then((results) =>
                setSearchFeatures(results),
              );
            }}
            isGeolocation={isGeolocation}
            onGeolocationClick={mapRef.current?.toggleGeolocation}
          />
          {!!searchFeatures.length && (
            <div className="w-full absolute z-20 shadow-lg bottom-11 sm:bottom-auto sm:top-full mb-3 bg-background-lightmode dark:bg-background-darkmode rounded-lg py-4">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                searchFeatures.map((feature: any, i) => {
                  return (
                    <button
                      className="text-left w-full hover:bg-gray-lightmode hover:dark:bg-gray-darkmode hover:bg-opacity-10 hover:dark:bg-opacity-20 px-4 py-2"
                      onMouseDown={() => onSearchFeatureClick(feature)}
                      key={i}
                    >
                      {feature.place_name_sk.split(",")[0]}
                    </button>
                  );
                })
              }
            </div>
          )}
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
          values={statusFilter.values.map((status) => ({
            key: status.key,
            label: t(`filters.status.${status.key}`),
            isActive: status.isActive,
          }))}
          onTagClick={(status) => {
            if (statusFilter.activeKeys.length == 4) {
              statusFilter.setActiveOnly(status);
            } else if (
              !(statusFilter.activeKeys.length == 1 && statusFilter.activeKeys[0] == status)
            ) {
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
    <Slot name="mobile-filters" isVisible={isVisible}>
      <Sidebar
        position="right"
        isMobile
        isVisible={isVisible}
        setVisible={setVisible}
        title={t("title")}
      >
        {content}
      </Sidebar>
    </Slot>
  ) : (
    <Slot openPadding={{ left: 384 }} name="desktop-filters" isVisible={isVisible}>
      <Sidebar
        isMobile={false}
        position="left"
        isVisible={isVisible}
        setVisible={setVisible}
        title={t("title")}
      >
        {content}
      </Sidebar>
    </Slot>
  );
};
