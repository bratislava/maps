import {
  forwardGeocode,
  GeocodeFeature,
  IFilterResult,
  MapHandle,
} from "@bratislava/react-maps-core";
import { X } from "@bratislava/react-maps-icons";
import {
  Divider,
  Select,
  TagFilter,
  SearchBar,
  SelectOption,
  Sidebar,
} from "@bratislava/react-maps-ui";
import mapboxgl from "mapbox-gl";
import { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { treeKindNameSkMappingObject } from "../../utils/utils";
import { ILayerCategory, Layers } from "../Layers";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IDesktopFiltersProps<Y, D, S, T, K> {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  areFiltersDefault: boolean;
  onResetFiltersClick: () => void;
  mapRef: RefObject<MapHandle>;
  mapboxgl: typeof mapboxgl;
  isGeolocation: boolean;
  yearFilter: IFilterResult<Y>;
  districtFilter: IFilterResult<D>;
  kindFilter: IFilterResult<K>;
  seasonFilter: IFilterResult<S>;
  layerFilter: IFilterResult<T>;
  layerCategories: ILayerCategory[];
}

export const DesktopFilters = <
  Y extends string,
  D extends string,
  S extends string,
  T extends string,
  K extends string,
>({
  isVisible,
  setVisible,
  areFiltersDefault,
  onResetFiltersClick,
  mapRef,
  mapboxgl,
  isGeolocation,
  yearFilter,
  districtFilter,
  kindFilter,
  seasonFilter,
  layerFilter,
  layerCategories,
}: IDesktopFiltersProps<Y, D, S, T, K>) => {
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

  return (
    <Sidebar
      position="left"
      isMobile={false}
      isVisible={isVisible}
      setVisible={setVisible}
      title={t("title")}
    >
      <div className="mx-6 relative">
        <SearchBar
          value={searchQuery}
          placeholder={t("search")}
          onFocus={(e) => {
            forwardGeocode(mapboxgl, e.target.value).then((results) => setSearchFeatures(results));
          }}
          onBlur={() => setSearchFeatures([])}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            forwardGeocode(mapboxgl, e.target.value).then((results) => setSearchFeatures(results));
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

      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-6 items-center">
          <h2 className="font-semibold text-md py-1">{t("filters.title")}</h2>
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

        <div className="w-full grid grid-cols-3 gap-4 px-6">
          <Select
            className="w-full col-span-3"
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
            className="w-full"
            value={yearFilter.activeKeys}
            isMultiple
            onChange={(value) => yearFilter.setActiveOnly((value ?? []) as Y[])}
            onReset={() => yearFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values}
                placeholder={t("filters.year.placeholder")}
                singlePlaceholder={""}
                multiplePlaceholder={""}
              />
            )}
          >
            {yearFilter.keys.map((year) => (
              <SelectOption key={year} value={year}>
                {year}
              </SelectOption>
            ))}
          </Select>

          <Select
            className="w-full col-span-2"
            value={kindFilter.activeKeys}
            isMultiple
            onChange={(value) => kindFilter.setActiveOnly((value ?? []) as K[])}
            onReset={() => kindFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values.map((v) => treeKindNameSkMappingObject[v])}
                placeholder={t("filters.kind.placeholder")}
                multiplePlaceholder={`${t("filters.kind.multipleKinds")} (${values.length})`}
              />
            )}
          >
            {kindFilter.keys.map((kind) => (
              <SelectOption key={kind} value={kind}>
                {treeKindNameSkMappingObject[kind]}
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

        <Layers isMobile={false} filter={layerFilter} layers={layerCategories} />
      </div>
    </Sidebar>
  );
};
