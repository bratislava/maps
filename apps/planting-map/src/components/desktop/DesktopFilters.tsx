import { MapHandle } from "@bratislava/react-maps";
import { FilterExpression, IFilterResult } from "@bratislava/react-mapbox";
import { X } from "@bratislava/react-maps-icons";
import {
  Divider,
  Select,
  SelectOption,
  Sidebar,
  AddressSearchBox,
  AddressPointFeature,
} from "@bratislava/react-maps-ui";
import { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { treeKindNameSkMappingObject } from "../../utils/utils";
import { ILayerCategory, Layers } from "../Layers";
import { SelectValueRenderer } from "../SelectValueRenderer";
import { Feature, Point } from "geojson";

export interface IDesktopFiltersProps {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  areFiltersDefault: boolean;
  onResetFiltersClick: () => void;
  mapRef: RefObject<MapHandle>;
  isGeolocation: boolean;
  yearFilter: IFilterResult<string>;
  districtFilter: IFilterResult<string>;
  kindFilter: IFilterResult<string>;
  seasonFilter: IFilterResult<string>;
  layerFilter: IFilterResult<string>;
  layerCategories: ILayerCategory[];
  filters: FilterExpression;
  onSearchFeatureClick: (feature: Feature<Point>) => void;
  onSearchFeatureReset: () => void;
}

export const DesktopFilters = ({
  isVisible,
  setVisible,
  areFiltersDefault,
  onResetFiltersClick,
  mapRef,
  isGeolocation,
  yearFilter,
  districtFilter,
  kindFilter,
  layerFilter,
  layerCategories,
  onSearchFeatureClick,
  onSearchFeatureReset,
}: IDesktopFiltersProps) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchFeatureClick = useCallback(
    (feature: AddressPointFeature) => {
      setSearchQuery(`${feature.properties.name} ${feature.properties.number}`);
      mapRef.current?.fitFeature(feature);
      onSearchFeatureClick(feature);
    },
    [mapRef, onSearchFeatureClick],
  );

  const onResetPress = useCallback(() => {
    setSearchQuery("");
    onSearchFeatureReset();
  }, [onSearchFeatureReset]);

  return (
    <Sidebar
      position="left"
      isMobile={false}
      isVisible={isVisible}
      setVisible={setVisible}
      title={t("title")}
    >
      <div className="mx-6 relative">
        <AddressSearchBox
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onResetPress={onResetPress}
          onAddressPress={handleSearchFeatureClick}
          isGeolocation={isGeolocation}
          onGeolocationClick={mapRef.current?.toggleGeolocation}
        />
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
            value={yearFilter.activeKeys}
            isMultiple
            onChange={(value) => yearFilter.setActiveOnly(value ?? [])}
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
            onChange={(value) => kindFilter.setActiveOnly(value ?? [])}
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

      {/* <pre className="p-2 h-72 bg-black text-white overflow-auto">
        <code>{JSON.stringify(filters, null, 2)}</code>
      </pre> */}
    </Sidebar>
  );
};
