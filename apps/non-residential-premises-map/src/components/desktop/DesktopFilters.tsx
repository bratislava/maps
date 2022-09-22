import { FilterExpression, IFilterResult } from "@bratislava/react-mapbox";
import { forwardGeocode, GeocodeFeature, MapHandle } from "@bratislava/react-maps";
import { X } from "@bratislava/react-maps-icons";
import { Divider, SearchBar, Select, SelectOption, Sidebar } from "@bratislava/react-maps-ui";
import { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IDesktopFiltersProps {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  areFiltersDefault: boolean;
  onResetFiltersClick: () => void;
  mapRef: RefObject<MapHandle>;
  isGeolocation: boolean;
  purposeFilter: IFilterResult<string>;
  districtFilter: IFilterResult<string>;
  occupancyFilter: IFilterResult<string>;
  filters: FilterExpression;
}

export const DesktopFilters = ({
  isVisible,
  setVisible,
  areFiltersDefault,
  onResetFiltersClick,
  mapRef,
  isGeolocation,
  purposeFilter,
  districtFilter,
  occupancyFilter,
}: IDesktopFiltersProps) => {
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
            forwardGeocode(import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN, e.target.value).then(
              (results) => setSearchFeatures(results),
            );
          }}
          onBlur={() => setSearchFeatures([])}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            forwardGeocode(import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN, e.target.value).then(
              (results) => setSearchFeatures(results),
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
            className="w-full"
            value={purposeFilter.activeKeys}
            isMultiple
            onChange={(value) => purposeFilter.setActiveOnly(value ?? [])}
            onReset={() => purposeFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values}
                placeholder={t("filters.purpose.placeholder")}
                singlePlaceholder={""}
                multiplePlaceholder={""}
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
            className="w-full col-span-2"
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
