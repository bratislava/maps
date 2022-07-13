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
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IDesktopFiltersProps<Y, D, S, T> {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  areFiltersDefault: boolean;
  onResetFiltersClick: () => void;
  mapRef: RefObject<MapHandle>;
  mapboxgl: typeof mapboxgl;
  isGeolocation: boolean;
  districtFilter: IFilterResult<D>;
  typeFilter: IFilterResult<S>;
}

export const DesktopFilters = <
  Y extends string,
  D extends string,
  S extends string,
  T extends string,
>({
  isVisible,
  setVisible,
  areFiltersDefault,
  onResetFiltersClick,
  mapRef,
  mapboxgl,
  isGeolocation,
  districtFilter,
  typeFilter,
}: IDesktopFiltersProps<Y, D, S, T>) => {
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
          <div className="w-full absolute z-20 shadow-lg bottom-11 sm:bottom-auto sm:top-full mb-3 bg-white rounded-lg py-4">
            {searchFeatures.map((feature: any, i) => {
              return (
                <button
                  className="text-left w-full hover:bg-background px-4 py-2"
                  onMouseDown={() => onSearchFeatureClick(feature)}
                  key={i}
                >
                  {feature.place_name_sk.split(",")[0]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between px-6 items-center">
        <h2 className="font-semibold text-md py-1">{t("filters.title")}</h2>
        {!areFiltersDefault && (
          <button onClick={onResetFiltersClick} className="flex gap-2 items-center hover:underline">
            <span className="font-semibold">{t("filters.reset")}</span>
            <X className="text-primary" />
          </button>
        )}
      </div>

      <div className="w-full flex flex-col gap-4 px-6">
        <Select
          className="w-full"
          value={districtFilter.activeKeys}
          isMultiple
          onChange={(value) => districtFilter.setActiveOnly((value ?? []) as D[])}
          onReset={() => districtFilter.setActiveAll(false)}
          renderValue={({ values }) => (
            <SelectValueRenderer
              values={values}
              placeholder={t("filters.district.placeholder")}
              multiplePlaceholder={`${t("filters.district.multipleDistricts")} (${values.length})`}
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

      <TagFilter
        title={t("filters.type.title")}
        values={typeFilter.values.map((type) => ({
          key: type.key,
          label: t(`filters.type.types.${type.key}`),
          isActive: type.isActive,
        }))}
        onTagClick={(type) => {
          if (typeFilter.activeKeys.length == typeFilter.values.length) {
            typeFilter.setActiveOnly(type);
          } else if (!(typeFilter.activeKeys.length == 1 && typeFilter.activeKeys[0] == type)) {
            typeFilter.toggleActive(type);
          }
        }}
      />
    </Sidebar>
  );
};
