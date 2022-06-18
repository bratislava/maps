import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "../styles.css";
import { useResizeDetector } from "react-resize-detector";

// maps
import {
  useMap,
  Layer,
  addDistrictPropertyToLayer,
  forwardGeocode,
  DISTRICTS_GEOJSON,
  ALL_DISTRICTS_KEY,
  usePrevious,
} from "@bratislava/mapbox-maps-core";
import {
  Accordion,
  AccordionItem,
  Checkbox,
  Divider,
  LoadingSpinner,
  SearchBar,
  Select,
  SelectOption,
  Tag,
  UNSELECTED_OPTION_KEY,
} from "@bratislava/mapbox-maps-ui";
import { Close, Eye, ChevronLeftSmall, EyeCrossed, Funnel } from "@bratislava/mapbox-maps-icons";
import { useArcgeo } from "@bratislava/mapbox-maps-esri";
import { getSeasonFromDate, getRandomItemFrom } from "@bratislava/maps-utils";

// components
import { Detail } from "./Detail";

// layer styles
import ESRI_STYLE from "../assets/layers/esri/esri";
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
import i18next from "../utils/i18n";
import {
  disableKeyStateValue,
  enableKeyStateValue,
  getKeyStateValue,
  KeyStateRecord,
  processData,
  toggleKeyStateValue,
} from "../utils/utils";
import AnimateHeight from "react-animate-height";

const URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/ArcGIS/rest/services/orezy_a_vyruby_2022_OTMZ_zobrazenie/FeatureServer/0";

// predefined colors for points
const mapCircleColors: { [index: string]: string } = {
  "výrub inváznej dreviny": "#F4B056",
  "výrub havarijný": "#E57D00",
  "výrub z rozhodnutia": "#E03F00",
  "manažment imela": "#7F674A",
  "injektáž inváznej dreviny": "#351900",
  "odstránenie padnutého stromu": "#BC9F82",
  "frézovanie pňa": "#54463B",
};

const orezColors = ["#FFD400", "#FCE304", "#FFF500", "#FCE300", "#FFE045", "#FEE980", "#FFE600"];

const CATEGORIES = [
  {
    label: "Výrub",
    types: ["výrub z rozhodnutia", "výrub havarijný", "výrub inváznej dreviny"],
  },
  {
    label: "Orez",
    types: ["orez"],
  },
  {
    label: "Invázne dreviny",
    types: ["injektáž inváznej dreviny", "výrub inváznej dreviny"],
  },
];

const DEFAULT_SEASON_FILTER_STATE = [
  { key: "spring", state: true },
  { key: "summer", state: true },
  { key: "autumn", state: true },
  { key: "winter", state: true },
];

export const App = () => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [esriGeojson, setEsriGeojson] = useState<ReturnType<typeof useArcgeo>["data"]>(null);

  const { data } = useArcgeo(URL);

  useEffect(() => {
    if (data) {
      setEsriGeojson(
        addDistrictPropertyToLayer({
          ...data,
          features: data.features.map((feature) => {
            const type = feature.properties?.TYP_VYKONU_1?.toLowerCase();
            const dateString = feature.properties?.TERMIN_REAL_1;
            const year = dateString ? new Date(dateString).getFullYear().toString() : undefined;
            const season = getSeasonFromDate(dateString);
            const color =
              typeof type === "string"
                ? type === "orez"
                  ? getRandomItemFrom(orezColors)
                  : mapCircleColors[type]
                : "#54463B";

            return {
              ...feature,
              properties: {
                ...feature.properties,
                TYP_VYKONU_1: type,
                season,
                color,
                year,
              },
            };
          }),
        }),
      );
    }
  }, [data]);

  const [otherTypes, setOtherTypes] = useState<string[]>([]);

  const [typeFiltersState, setTypeFiltersState] = useState<KeyStateRecord<boolean>[]>([]);
  const [seasonFiltersState, setSeasonFiltersState] = useState<KeyStateRecord<boolean>[]>(
    JSON.parse(JSON.stringify(DEFAULT_SEASON_FILTER_STATE)),
  );

  const [filters, setFilters] = useState<any[]>([]);

  const [yearOptions, setYearOptions] = useState<SelectOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<SelectOption[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(UNSELECTED_OPTION_KEY);

  const [activeFilters, setActiveFilters] = useState<{ title: string; items: string[] }[]>([]);

  useEffect(() => {
    if (esriGeojson) {
      const { otherTypes, typeFiltersState, yearOptions, districtOptions } = processData(
        esriGeojson,
        CATEGORIES,
      );
      setYearOptions(yearOptions);
      setDistrictOptions(districtOptions);
      setOtherTypes(otherTypes);
      setTypeFiltersState(typeFiltersState);
      setLoading(false);
    }
  }, [esriGeojson]); 

  const { Map, ...mapProps } = useMap({
    mapboxAccessToken: import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN,
    i18next: i18next,
    mapStyles: {
      light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
      dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      satellite: import.meta.env.PUBLIC_MAPBOX_SATELLITE_STYLE,
    },
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchFeatures, setSearchFeatures] = useState<any[]>([]);

  const {
    geolocationState: [isGeolocation, setGeolocation],
    mapboxgl,
    ref: mapRef,
    selectedDistrictState: [selectedDistrict, setSelectedDistrict],
    fitToDistrict,
    selectedFeaturesState: [selectedFeatures, setSelectedFeatures],
    mobileState: [isMobile],
  } = mapProps;

  const onSearchFeatureClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any) => {
      setSearchQuery(feature.place_name_sk.split(",")[0]);
      setSearchFeatures([]);
      if (mapRef && feature.geometry.type === "Point") {
        console.log(mapRef.current);

        mapRef.current?.setViewport({
          lng: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
          zoom: 18,
        });
      }
    },
    [mapRef],
  );

  const toggleTypeFilter = useCallback(
    (type: string) => {
      setTypeFiltersState(toggleKeyStateValue(typeFiltersState, type));
    },
    [typeFiltersState],
  );

  const toggleSeasonFilter = useCallback(
    (season: string) => {
      if (
        seasonFiltersState.filter((seasonFilterState) => seasonFilterState.state).length === 1 &&
        seasonFiltersState.find((f) => f.key === season)?.state === true
      ) {
        // if only one filter is selected do nothing
      } else if (
        seasonFiltersState.filter((seasonFilterState) => seasonFilterState.state).length ===
        seasonFiltersState.length
      ) {
        // if all filters are enabled disable the others
        setSeasonFiltersState(
          toggleKeyStateValue(
            JSON.parse(
              JSON.stringify(
                DEFAULT_SEASON_FILTER_STATE.map((filterState) => ({
                  ...filterState,
                  state: false,
                })),
              ),
            ),
            season,
          ),
        );
      } else {
        // else just toggle
        setSeasonFiltersState(toggleKeyStateValue(seasonFiltersState, season));
      }
    },
    [seasonFiltersState],
  );

  const isAnyTypeEnabled = useCallback(
    (types: string[]) => {
      let isSomeTypeEnabled = false;
      for (const typeFilterState of typeFiltersState) {
        if (typeFilterState.state && types.find((type) => type == typeFilterState.key)) {
          isSomeTypeEnabled = true;
          break;
        }
      }
      return isSomeTypeEnabled;
    },
    [typeFiltersState],
  );

  const onCategoryVisibilityClick = useCallback(
    (types: string[]) => {
      if (isAnyTypeEnabled(types)) {
        types.forEach((type) =>
          setTypeFiltersState(() => disableKeyStateValue(typeFiltersState, type)),
        );
      } else {
        types.forEach((type) =>
          setTypeFiltersState(() => enableKeyStateValue(typeFiltersState, type)),
        );
      }
    },
    [typeFiltersState, setTypeFiltersState, isAnyTypeEnabled],
  );

  const onFilteringReset = () => {
    setSeasonFiltersState(JSON.parse(JSON.stringify(DEFAULT_SEASON_FILTER_STATE)));
    if (selectedYear != UNSELECTED_OPTION_KEY) setSelectedYear(UNSELECTED_OPTION_KEY);
    if (selectedDistrict != ALL_DISTRICTS_KEY) setSelectedDistrict(ALL_DISTRICTS_KEY);
  };

  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const previousSidebarVisible = usePrevious(isSidebarVisible);

  const areFiltersDefault = useCallback(() => {
    return (
      selectedYear === UNSELECTED_OPTION_KEY &&
      selectedDistrict === ALL_DISTRICTS_KEY &&
      JSON.stringify(seasonFiltersState) === JSON.stringify(DEFAULT_SEASON_FILTER_STATE)
    );
  }, [selectedYear, selectedDistrict, seasonFiltersState]);

  useEffect(() => {
    const typeFilters: any[] = [];
    const seasonFilters: any[] = [];

    typeFiltersState.forEach((typeFilterState) => {
      if (typeFilterState.state) {
        typeFilters.push(["==", "TYP_VYKONU_1", typeFilterState.key]);
      }
    });

    seasonFiltersState.forEach((seasonFilterState) => {
      if (seasonFilterState.state) {
        seasonFilters.push(["==", "season", seasonFilterState.key]);
      }
    });

    const filters = ["all", ["any", ...typeFilters], ["any", ...seasonFilters]];

    if (selectedYear && selectedYear != UNSELECTED_OPTION_KEY) {
      filters.push(["==", "year", selectedYear]);
    }

    setFilters(filters);
  }, [typeFiltersState, seasonFiltersState, setFilters, selectedYear]);

  useEffect(() => {
    const activeFilters = [];

    selectedYear && selectedYear != UNSELECTED_OPTION_KEY
      ? activeFilters.push({
          title: t("filters.year.title"),
          items: [selectedYear],
        })
      : null;

    selectedDistrict && selectedDistrict != ALL_DISTRICTS_KEY
      ? activeFilters.push({
          title: t("filters.district.title"),
          items: [selectedDistrict],
        })
      : null;

    !areFiltersDefault()
      ? activeFilters.push({
          title: t("filters.season.title"),
          items: [
            ...seasonFiltersState
              .filter((f) => f.state)
              .map((f) => t(`filters.season.seasons.${f.key}`)),
          ],
        })
      : null;

    setActiveFilters(activeFilters);
  }, [selectedYear, selectedDistrict, areFiltersDefault]);

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
  }, [isMobile, isSidebarVisible, previousSidebarVisible]);

  useEffect(() => {
    if (isMobile == false) {
      setSidebarVisible(false);
    }
  }, [isMobile]);

  const closeDetail = useCallback(() => {
    setSelectedFeatures([]);
  }, [setSelectedFeatures]);

  const { height: mobileActiveFiltersContentHeight, ref: mobileActiveFiltersContentRef } =
    useResizeDetector();

  return isLoading ? (
    <div
      className={cx(
        "fixed z-50 top-0 right-0 bottom-0 left-0 bg-white flex items-center justify-center text-primary duration-500",
        {
          "visible opacity-100 transition-none": isLoading,
          "invisible opacity-0 transition-all": !isLoading,
        },
      )}
    >
      <LoadingSpinner size={96} color="var(--primary-color)" />
    </div>
  ) : (
    <Map
      {...mapProps}
      isOutsideLoading={isLoading}
      districtFiltering={true}
      showDistrictSelect={false}
      title={t("title")}
      onDistrictChange={fitToDistrict}
      moveSearchBarOutsideOfSideBarOnLargeScreen
      sources={{
        ESRI_DATA: esriGeojson,
        DISTRICTS_GEOJSON,
      }}
      slots={[
        // MOBILE SLOTS
        {
          name: "mobile-header",
          isMobileOnly: true,
          className: "top-4 right-4 z-10",
          component: (
            <button
              onClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
              className="flex text-font w-12 h-12 items-center justify-center pointer-events-auto shadow-lg bg-background rounded-lg"
            >
              <Funnel className="w-12 h-12" />
            </button>
          ),
        },
        {
          name: "mobile-filter",
          animation: "slide-right",
          isMobileOnly: true,
          isVisible: isSidebarVisible,
          className: "top-0 left-0 bottom-0 w-full z-30",
          component: (
            <div className="w-full h-full pr-0 relative bg-background shadow-lg flex flex-col justify-between">
              <div className="space-y-6 w-full h-full overflow-auto relative">
                <div className="flex items-center pl-5 pr-8 pt-6 pb-3 gap-2">
                  <button onClick={() => setSidebarVisible(false)} className="flex p-2">
                    <ChevronLeftSmall className="text-primary" width={16} height={16} />
                  </button>
                  <h1 className="text-lg relative font-medium">{t("title")}</h1>
                </div>

                <AnimateHeight
                  className={cx("bg-gray bg-opacity-10 transition-opacity", {
                    "opacity-0": areFiltersDefault(),
                  })}
                  aria-hidden={false}
                  height={areFiltersDefault() ? 1 : mobileActiveFiltersContentHeight ?? 1}
                >
                  <div ref={mobileActiveFiltersContentRef}>
                    <div className="p-8 flex flex-col gap-4">
                      <h2 className="font-bold text-md">{t("filters.active")}</h2>
                      <div className="flex gap-x-8 flex-wrap">
                        {activeFilters.map(({ title, items }, index) => (
                          <div key={index}>
                            <div className="italic">{title}</div>
                            <div className="font-bold">{items.join(", ")}</div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={onFilteringReset}
                        className="flex items-center hover:underline"
                      >
                        <span className="font-bold">{t("filters.resetFilter")}</span>
                        <Close className="text-primary" width={32} height={32} />
                      </button>
                    </div>
                  </div>
                </AnimateHeight>

                <div className="flex px-8 items-center gap-2">
                  <div className="-m-2">
                    <Funnel width={48} height={48} />
                  </div>
                  <h2 className="font-bold text-md py-1">{t("filters.title")}</h2>
                </div>
                <div className="w-full grid gap-4 px-8">
                  <Select
                    className="w-full"
                    value={selectedYear}
                    options={[
                      {
                        key: UNSELECTED_OPTION_KEY,
                        label: t("filters.year.allYears"),
                      },
                      ...yearOptions,
                    ]}
                    onChange={(year) => setSelectedYear(year)}
                  />

                  <Select
                    className="w-full"
                    value={selectedDistrict}
                    options={[
                      {
                        key: ALL_DISTRICTS_KEY,
                        label: t("filters.district.allDistricts"),
                      },
                      ...districtOptions,
                    ]}
                    onChange={(district) => setSelectedDistrict(district)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="px-8">{t("filters.season.title")}</label>
                  <div className="flex flex-wrap gap-2 px-8">
                    {["spring", "summer", "autumn", "winter"].map((season) => (
                      <Tag
                        key={season}
                        className={cx("cursor-pointer", {
                          "bg-primary-soft": getKeyStateValue(seasonFiltersState, season),
                        })}
                        onClick={() => toggleSeasonFilter(season)}
                      >
                        {t(`filters.season.seasons.${season}`)}
                      </Tag>
                    ))}
                  </div>
                </div>
                <Divider className="mx-8" />
                <h2 className="font-bold px-8 text-md">{t("layersLabel")}</h2>
                <div className="flex flex-col w-full">
                  <Accordion>
                    {CATEGORIES.map(({ label, types }, index) => {
                      return (
                        <AccordionItem
                          isOpenable={types.length > 1}
                          className={cx("border-l-4 border-white")}
                          key={index}
                          title={label}
                          rightSlot={
                            <button
                              className="cursor-pointer p-1"
                              onClick={() => onCategoryVisibilityClick(types)}
                            >
                              {isAnyTypeEnabled(types) ? (
                                <EyeCrossed width={18} height={18} />
                              ) : (
                                <Eye width={18} height={18} />
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
                                checked={getKeyStateValue(typeFiltersState, type)}
                                onChange={() => toggleTypeFilter(type)}
                              />
                            );
                          })}
                        </AccordionItem>
                      );
                    })}
                    <AccordionItem
                      className={cx("border-l-4 border-white")}
                      title="Ostatná starostlivosť"
                      rightSlot={
                        <button
                          className="cursor-pointer p-1"
                          onClick={() => onCategoryVisibilityClick(otherTypes)}
                        >
                          {isAnyTypeEnabled(otherTypes) ? (
                            <EyeCrossed width={18} height={18} />
                          ) : (
                            <Eye width={18} height={18} />
                          )}
                        </button>
                      }
                    >
                      {otherTypes.map((type) => {
                        return (
                          <Checkbox
                            key={type}
                            id={type}
                            label={type}
                            checked={getKeyStateValue(typeFiltersState, type)}
                            onChange={() => toggleTypeFilter(type)}
                          />
                        );
                      })}
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="sticky top-full bg-gray bg-opacity-10">
                  <button
                    onClick={() => setSidebarVisible(false)}
                    className="p-3 flex items-center hover:underline justify-center mx-auto"
                  >
                    <span className="font-bold">{t("close")}</span>
                    <Close className="text-primary" width={32} height={32} />
                  </button>
                </div>
              </div>
            </div>
          ),
        },
        {
          name: "mobile-detail",
          bottomSheetOptions: {
            footer: (
              <div className="bg-gray bg-opacity-10 -m-4">
                <button
                  onClick={closeDetail}
                  className="p-3 flex items-center hover:underline justify-center mx-auto"
                >
                  <span className="font-bold">{t("close")}</span>
                  <Close className="text-primary" width={32} height={32} />
                </button>
              </div>
            ),
          },
          isMobileOnly: true,
          className: "z-20",
          isVisible: !!selectedFeatures.length,
          component: <Detail arcgeoServerUrl={URL} features={selectedFeatures} />,
        },
        {
          name: "mobile-search",
          isMobileOnly: true,
          isVisible: true,
          className: "bottom-10 left-4 right-4 z-10",
          component: (
            <div className="shadow-lg rounded-lg">
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
                onGeolocationClick={() => setGeolocation(!isGeolocation)}
              />
              {!!searchFeatures.length && (
                <div className="w-full absolute z-20 shadow-lg bottom-11 sm:bottom-auto sm:top-full mb-3 bg-white rounded-lg py-4">
                  {searchFeatures.map((feature, i) => {
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
          ),
        },

        // DESKTOP SLOTS
        {
          name: "desktop-filter",
          animation: "slide-left",
          isDesktopOnly: true,
          isVisible: isSidebarVisible,
          className: "top-0 left-0 bottom-0 w-96",
          component: (
            <div className="w-full h-full pr-0 relative">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSidebarVisible(!isSidebarVisible)}
                className="absolute right-0 bg-background rounded-br-lg z-20 py-8 transform translate-x-full hover:text-primary"
                onClick={() => {
                  setSidebarVisible(!isSidebarVisible);
                }}
              >
                <div
                  className="shadow-lg rounded-br-lg hidden sm:block absolute top-0 left-0 right-0 bottom-0 sm:shadow-lg"
                  style={{ zIndex: -20 }}
                ></div>
                <ChevronLeftSmall
                  width={24}
                  height={24}
                  className={cx("transform transition-transform", {
                    "rotate-180": !isSidebarVisible,
                  })}
                  stroke="var(--font-color)"
                />
                <div className="hidden sm:block bg-background absolute w-4 min-h-full box-content right-full top-0 pb-4"></div>
              </div>

              <div className="space-y-6 w-full h-full overflow-auto bg-background shadow-lg">
                <h1 className="text-lg relative z-30 font-medium px-8 pt-6 pb-3">{t("title")}</h1>

                <div className="mx-8 relative">
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
                    onGeolocationClick={() => setGeolocation(!isGeolocation)}
                  />
                  {!!searchFeatures.length && (
                    <div className="w-full absolute z-20 shadow-lg bottom-11 sm:bottom-auto sm:top-full mb-3 bg-white rounded-lg py-4">
                      {searchFeatures.map((feature, i) => {
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

                <div className="flex justify-between px-8 items-center">
                  <h2 className="font-bold text-md py-1">{t("filters.title")}</h2>
                  {!areFiltersDefault() && (
                    <button
                      onClick={onFilteringReset}
                      className="flex items-center hover:underline"
                    >
                      <span className="font-bold">{t("filters.reset")}</span>
                      <Close className="text-primary" width={32} height={32} />
                    </button>
                  )}
                </div>

                <div className="w-full grid grid-cols-3 gap-4 px-8">
                  <Select
                    className="w-full"
                    value={selectedYear}
                    options={[
                      {
                        key: UNSELECTED_OPTION_KEY,
                        label: t("filters.year.allYears"),
                      },
                      ...yearOptions,
                    ]}
                    onChange={(year) => setSelectedYear(year)}
                  />

                  <Select
                    className="w-full col-span-2"
                    value={selectedDistrict}
                    options={[
                      {
                        key: ALL_DISTRICTS_KEY,
                        label: t("filters.district.allDistricts"),
                      },
                      ...districtOptions,
                    ]}
                    onChange={(district) => setSelectedDistrict(district)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="px-8">{t("filters.season.title")}</label>
                  <div className="flex flex-wrap gap-2 px-8">
                    {["spring", "summer", "autumn", "winter"].map((season) => (
                      <Tag
                        key={season}
                        className={cx("cursor-pointer", {
                          "bg-primary-soft": getKeyStateValue(seasonFiltersState, season),
                        })}
                        onClick={() => toggleSeasonFilter(season)}
                      >
                        {t(`filters.season.seasons.${season}`)}
                      </Tag>
                    ))}
                  </div>
                </div>

                <Divider className="mx-8" />

                <h2 className="font-bold px-8 text-md">{t("layersLabel")}</h2>

                <div className="flex flex-col w-full">
                  <Accordion>
                    {CATEGORIES.map(({ label, types }, index) => {
                      return (
                        <AccordionItem
                          isOpenable={types.length > 1}
                          className={cx("border-l-4", {
                            "bg-gray bg-opacity-10 border-primary": isAnyTypeEnabled(types),
                            "border-transparent": !isAnyTypeEnabled(types),
                          })}
                          key={index}
                          title={label}
                          rightSlot={
                            <button
                              className="cursor-pointer p-1"
                              onClick={() => onCategoryVisibilityClick(types)}
                            >
                              {isAnyTypeEnabled(types) ? (
                                <EyeCrossed width={18} height={18} />
                              ) : (
                                <Eye width={18} height={18} />
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
                                checked={getKeyStateValue(typeFiltersState, type)}
                                onChange={() => toggleTypeFilter(type)}
                              />
                            );
                          })}
                        </AccordionItem>
                      );
                    })}
                    <AccordionItem
                      className={cx("border-l-4", {
                        "bg-gray bg-opacity-10 border-primary": isAnyTypeEnabled(otherTypes),
                        "border-transparent": !isAnyTypeEnabled(otherTypes),
                      })}
                      title="Ostatná starostlivosť"
                      rightSlot={
                        <button
                          className="cursor-pointer p-1"
                          onClick={() => onCategoryVisibilityClick(otherTypes)}
                        >
                          {isAnyTypeEnabled(otherTypes) ? (
                            <EyeCrossed width={18} height={18} />
                          ) : (
                            <Eye width={18} height={18} />
                          )}
                        </button>
                      }
                    >
                      {otherTypes.map((type) => {
                        return (
                          <Checkbox
                            key={type}
                            id={type}
                            label={type}
                            checked={getKeyStateValue(typeFiltersState, type)}
                            onChange={() => toggleTypeFilter(type)}
                          />
                        );
                      })}
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          ),
        },
        {
          name: "desktop-detail",
          animation: "slide-right",
          isDesktopOnly: true,
          isVisible: !!selectedFeatures.length,
          className: "top-0 right-0 w-96 bg-background shadow-lg",
          component: <Detail arcgeoServerUrl={URL} features={selectedFeatures} />,
        },
      ]}
    >
      <Layer filters={filters} isVisible source="ESRI_DATA" styles={ESRI_STYLE} />
      <Layer ignoreFilters ignoreClick source="DISTRICTS_GEOJSON" styles={DISTRICTS_STYLE} />
    </Map>
  );
};

export default App;
