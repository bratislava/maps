import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "../styles.css";
import { useResizeDetector } from "react-resize-detector";

// maps
import {
  DISTRICTS_GEOJSON,
  usePrevious,
  Slot,
  Layout,
  MapHandle,
  Map,
  Layer,
  useFilter,
  useClickOutside,
} from "@bratislava/react-maps-core";
import { DropdownArrow, IActiveFilter, Sidebar } from "@bratislava/react-maps-ui";
import { Close } from "@bratislava/react-maps-icons";
import { useArcgeo } from "@bratislava/react-esri";

// components
import { Detail } from "./Detail";

// layer styles
import ESRI_STYLE from "../assets/layers/esri/esri";
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
import i18next from "../utils/i18n";
import { processData, mapCircleColors } from "../utils/utils";
import mapboxgl from "mapbox-gl";
import { Feature, FeatureCollection } from "geojson";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileFilters } from "./mobile/MobileFilters";
import { DesktopFilters } from "./desktop/DesktopFilters";
import { MobileSearch } from "./mobile/MobileSearch";
import { Legend } from "./Legend";

const URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/ArcGIS/rest/services/orezy_a_vyruby_2022_OTMZ_zobrazenie/FeatureServer/0";

export const App = () => {
  const { t } = useTranslation();

  const [typeCategories, setTypeCategories] = useState<
    {
      label: string;
      types: string[];
    }[]
  >([]);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);

  const { data: rawData } = useArcgeo(URL);
  // USE STATE
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueSeasons, setUniqueSeasons] = useState<string[]>([]);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);
  const [isLegendVisible, setLegendVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (rawData) {
      const knownCategories = [
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

      const { data, uniqueYears, uniqueDistricts, uniqueSeasons, uniqueTypes, otherTypes } =
        processData(rawData, knownCategories);

      setData(data);
      setUniqueYears(uniqueYears);
      setUniqueDistricts(uniqueDistricts);
      setUniqueSeasons(uniqueSeasons);
      setUniqueTypes(uniqueTypes);

      setTypeCategories([
        ...knownCategories,
        {
          label: "Ostatné",
          types: otherTypes,
        },
      ]);
      setLoading(false);
    }
  }, [rawData]);

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const [selectedFeatures, setSelectedFeatures] = useState<Feature[] | null>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);
  const [isGeolocation, setGeolocation] = useState(false);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const yearFilter = useFilter({
    property: "year",
    keys: uniqueYears,
  });

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  const seasonFilter = useFilter({
    property: "season",
    keys: uniqueSeasons,
    defaultValues: useMemo(() => ({ spring: true, summer: true, autumn: true, winter: true }), []),
  });

  const typeFilter = useFilter({
    property: "TYP_VYKONU_1",
    keys: uniqueTypes,
    defaultValues: useMemo(
      () => uniqueTypes.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}),
      [uniqueTypes],
    ),
  });

  const areFiltersDefault = useMemo(() => {
    return yearFilter.areDefault && districtFilter.areDefault && seasonFilter.areDefault;
  }, [yearFilter.areDefault, districtFilter.areDefault, seasonFilter.areDefault]);

  const resetFilters = useCallback(() => {
    yearFilter.reset();
    seasonFilter.reset();
    districtFilter.reset();
  }, [yearFilter, seasonFilter, districtFilter]);

  const activeFilters: IActiveFilter[] = useMemo(() => {
    return [
      {
        title: t("filters.year.title"),
        items: yearFilter.activeKeys,
      },
      {
        title: t("filters.district.title"),
        items: districtFilter.activeKeys,
      },
      {
        title: t("filters.season.title"),
        items: seasonFilter.activeKeys.map((season) => t(`filters.season.seasons.${season}`)),
      },
    ];
  }, [t, yearFilter.activeKeys, districtFilter.activeKeys, seasonFilter.activeKeys]);

  const closeDetail = useCallback(() => {
    mapRef.current?.deselectAllFeatures();
  }, [mapRef]);

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
  }, [closeDetail, isMobile, isSidebarVisible, previousSidebarVisible]);

  // close sidebar on mobile and open on desktop
  useEffect(() => {
    // from mobile to desktop
    if (previousMobile !== false && isMobile === false) {
      setSidebarVisible(true);
    }
    // from desktop to mobile
    if (previousMobile !== true && isMobile === true) {
      setSidebarVisible(false);
    }
  }, [previousMobile, isMobile]);

  const isDetailOpen = useMemo(
    () => (selectedFeatures ? !!selectedFeatures.length : undefined),
    [selectedFeatures],
  );

  const onLegendClick = useCallback((e: MouseEvent) => {
    setLegendVisible((isLegendVisible) => !isLegendVisible);
    e.stopPropagation();
  }, []);

  // fit to district
  useEffect(() => {
    districtFilter.activeKeys.length == 1
      ? mapRef.current?.fitToDistrict(districtFilter.activeKeys[0])
      : mapRef.current?.changeViewport({
          center: {
            lat: 48.148598,
            lng: 17.107748,
          },
          zoom: 10.75,
        });
  }, [districtFilter.activeKeys, mapRef]);

  // move point to center when selected
  useEffect(() => {
    const MAP = mapRef.current;
    if (MAP && selectedFeatures && selectedFeatures.length) {
      const feature = selectedFeatures[0];
      setTimeout(() => {
        if (feature.geometry.type === "Point") {
          mapRef.current?.changeViewport({
            center: {
              lng: feature.geometry.coordinates[0],
              lat: feature.geometry.coordinates[1],
            },
          });
        }
      }, 0);
    }
  }, [selectedFeatures, mapRef]);

  const { height: desktopDetailHeight, ref: desktopDetailRef } =
    useResizeDetector<HTMLDivElement>();

  const legendRef = useClickOutside<HTMLDivElement | null>(() => {
    setLegendVisible(false);
  });

  return isLoading ? null : (
    <Map
      ref={mapRef}
      mapboxgl={mapboxgl}
      i18next={i18next}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
        satellite: import.meta.env.PUBLIC_MAPBOX_SATELLITE_STYLE,
      }}
      initialViewport={{
        center: {
          lat: 48.148598,
          lng: 17.107748,
        },
      }}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      moveSearchBarOutsideOfSideBarOnLargeScreen
      sources={{
        ESRI_DATA: data,
        DISTRICTS_GEOJSON,
      }}
      onSelectedFeaturesChange={setSelectedFeatures}
      onMobileChange={setMobile}
      onGeolocationChange={setGeolocation}
      onLegendClick={onLegendClick}
    >
      <Layer
        filters={[
          "all",
          yearFilter.filter,
          seasonFilter.filter,
          districtFilter.filter,
          typeFilter.filter,
        ]}
        isVisible
        source="ESRI_DATA"
        styles={ESRI_STYLE}
      />
      <Layer
        ignoreClick
        filters={["all", districtFilter.filter]}
        source="DISTRICTS_GEOJSON"
        styles={DISTRICTS_STYLE}
      />

      <Layout isOnlyMobile>
        <Slot name="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>

        <Slot
          name="mobile-filter"
          isVisible={isSidebarVisible}
          setVisible={setSidebarVisible}
          avoidControls={false}
        >
          <MobileFilters
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={areFiltersDefault}
            activeFilters={activeFilters}
            onResetFiltersClick={resetFilters}
            yearFilter={yearFilter}
            districtFilter={districtFilter}
            seasonFilter={seasonFilter}
            typeFilter={typeFilter}
            typeCategories={typeCategories}
          />
        </Slot>

        <Slot
          name="mobile-detail"
          isVisible={isDetailOpen}
          bottomSheetOptions={
            {
              // footer: (
              //   <div className="bg-gray bg-opacity-10 z-20">
              //     <button
              //       onClick={closeDetail}
              //       className="p-3 flex items-center hover:underline justify-center mx-auto"
              //     >
              //       <span className="font-bold">{t("close")}</span>
              //       <Close className="text-primary" width={32} height={32} />
              //     </button>
              //   </div>
              // ),
            }
          }
          openPadding={{
            bottom: window.innerHeight / 2, // w-96 or 24rem
          }}
          avoidControls={false}
        >
          <div className="h-full">
            <Detail arcgeoServerUrl={URL} features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
        </Slot>

        <Slot name="mobile-search">
          <MobileSearch mapRef={mapRef} mapboxgl={mapboxgl} isGeolocation={isGeolocation} />
        </Slot>

        <Slot
          name="mobile-legend"
          isVisible={isLegendVisible}
          setVisible={setLegendVisible}
          avoidControls={false}
        >
          <Sidebar
            title={t("title")}
            isVisible={isLegendVisible}
            setVisible={setLegendVisible}
            position="right"
          >
            <Legend mapCircleColors={{ ...mapCircleColors, "hranica mestskej časti": "#E29F45" }} />
          </Sidebar>
        </Slot>
      </Layout>

      <Layout isOnlyDesktop>
        <Slot
          name="desktop-filters"
          isVisible={isSidebarVisible}
          setVisible={setSidebarVisible}
          openPadding={{
            left: 384, // w-96 or 24rem
          }}
        >
          <DesktopFilters
            mapboxgl={mapboxgl}
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={areFiltersDefault}
            onResetFiltersClick={resetFilters}
            mapRef={mapRef}
            yearFilter={yearFilter}
            districtFilter={districtFilter}
            seasonFilter={seasonFilter}
            typeFilter={typeFilter}
            isGeolocation={isGeolocation}
            typeCategories={typeCategories}
          />
        </Slot>

        <Slot
          name="desktop-detail"
          isVisible={isDetailOpen}
          openPadding={{
            right: 384,
          }}
          avoidControls={window.innerHeight <= (desktopDetailHeight ?? 0) + 200 ? true : false}
        >
          <div
            ref={desktopDetailRef}
            className={cx("fixed top-0 right-0 w-96 bg-background transition-all duration-500", {
              "translate-x-full": !isDetailOpen,
              "shadow-lg": isDetailOpen,
            })}
          >
            <Detail arcgeoServerUrl={URL} features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
        </Slot>
        <Slot name="desktop-legend" isVisible={isLegendVisible} avoidControls={false}>
          <div
            ref={legendRef}
            className={cx(
              "absolute z-50 bottom-[92px] right-[90px] bg-background transform shadow-lg rounded-lg",
              {
                "scale-0": !isLegendVisible,
              },
            )}
          >
            <h3 className="px-6 pt-6 text-md font-semibold">Legenda</h3>
            <Legend mapCircleColors={{ ...mapCircleColors, "hranica mestskej časti": "#E29F45" }} />
            <DropdownArrow isBottom />
          </div>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
