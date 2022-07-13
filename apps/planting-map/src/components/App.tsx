import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  useCombinedFilter,
  Marker,
} from "@bratislava/react-maps-core";
import { useArcgeo } from "@bratislava/react-esri";

// components
import { Detail } from "./Detail";

// layer styles
import ESRI_STYLE from "../assets/layers/esri/esri";
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
import i18next from "../utils/i18n";
import { processData, treeKindNameSkMappingObject } from "../utils/utils";
import mapboxgl from "mapbox-gl";
import { Feature, FeatureCollection } from "geojson";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileFilters } from "./mobile/MobileFilters";
import { DesktopFilters } from "./desktop/DesktopFilters";
import { MobileSearch } from "./mobile/MobileSearch";
import { ILayerCategory } from "./Layers";
// import { Legend } from "./Legend";

const URL = "https://geoportal.bratislava.sk/hsite/rest/services/zp/STROMY/MapServer/0";

export const App = () => {
  const { t } = useTranslation();

  const [layerCategories, setLayerCategories] = useState<ILayerCategory[]>([]);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);

  const { data: rawData } = useArcgeo(URL, { pagination: false, format: "geojson" });

  // USE STATE
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueSeasons, setUniqueSeasons] = useState<string[]>([]);
  const [uniqueKinds, setUniqueKinds] = useState<string[]>([]);
  const [uniqueLayers, setUniqueLayers] = useState<string[]>([]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);
  // const [isLegendVisible, setLegendVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (rawData) {
      const { data, uniqueYears, uniqueKinds, uniqueDistricts, uniqueSeasons } =
        processData(rawData);

      setData(data);
      setUniqueYears(uniqueYears);
      setUniqueDistricts(uniqueDistricts);
      setUniqueSeasons(uniqueSeasons);
      setUniqueKinds(uniqueKinds);
      setUniqueLayers(["planting", "substitute-planting"]);

      setLayerCategories([
        {
          label: "Výsadba",
          subLayers: ["planting"],
        },
        {
          label: "Náhradná výsadba",
          subLayers: ["substitute-planting"],
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

  const layerFilter = useFilter({
    property: "layer",
    keys: uniqueLayers,
    defaultValues: useMemo(
      () => uniqueLayers.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}),
      [uniqueLayers],
    ),
  });

  const kindFilter = useFilter({
    property: "kind",
    keys: uniqueKinds,
  });

  const combinedFilter = useCombinedFilter({
    combiner: "all",
    filters: [
      {
        filter: yearFilter,
        mapToActive: (activeYears) => ({
          title: t("filters.year.title"),
          items: activeYears,
        }),
      },
      {
        filter: districtFilter,
        mapToActive: (activeDistricts) => ({
          title: t("filters.district.title"),
          items: activeDistricts,
        }),
      },
      {
        filter: kindFilter,
        mapToActive: (activeKinds) => ({
          title: t("filters.kind.title"),
          items: activeKinds.map((activeKind) => treeKindNameSkMappingObject[activeKind]),
        }),
      },
    ],
  });

  const closeDetail = useCallback(() => {
    mapRef.current?.deselectAllFeatures();
  }, [mapRef]);

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
    // if (!isMobile && previousMobile) {
    //   setLegendVisible((isLegendVisible) => !isLegendVisible);
    // }
  }, [closeDetail, isMobile, isSidebarVisible, previousMobile, previousSidebarVisible]);

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

  // const onLegendClick = useCallback((e: MouseEvent) => {
  //   setLegendVisible((isLegendVisible) => !isLegendVisible);
  //   e.stopPropagation();
  // }, []);

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

  // const legendRef = useClickOutside<HTMLDivElement | null>(() => {
  //   setLegendVisible(false);
  // });

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#237c36"
      ref={mapRef}
      mapboxgl={mapboxgl}
      i18next={i18next}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
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
      // onLegendClick={onLegendClick}
    >
      <Layer filters={combinedFilter.expression} isVisible source="ESRI_DATA" styles={ESRI_STYLE} />
      <Layer
        ignoreClick
        filters={districtFilter.expression}
        source="DISTRICTS_GEOJSON"
        styles={DISTRICTS_STYLE}
      />

      {!!selectedFeatures?.length && selectedFeatures[0].geometry.type === "Point" && (
        <Marker
          feature={{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: selectedFeatures[0].geometry.coordinates,
            },
            properties: {},
          }}
          isRelativeToZoom
        >
          <div
            className="w-10 h-10 bg-background-lightmode dark:bg-background-darkmode border-[6px] rounded-full"
            style={{ borderColor: selectedFeatures[0].properties?.["color"] }}
          ></div>
        </Marker>
      )}

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
            areFiltersDefault={combinedFilter.areDefault}
            activeFilters={combinedFilter.active}
            onResetFiltersClick={combinedFilter.reset}
            yearFilter={yearFilter}
            districtFilter={districtFilter}
            seasonFilter={seasonFilter}
            layerFilter={layerFilter}
            layerCategories={layerCategories}
            kindFilter={kindFilter}
          />
        </Slot>

        <Slot
          name="mobile-detail"
          isVisible={isDetailOpen}
          bottomSheetOptions={{}}
          openPadding={{
            bottom: window.innerHeight / 2, // w-96 or 24rem
          }}
          avoidControls={false}
        >
          <div className="h-full bg-background-lightmode dark:bg-background-darkmode text-foreground-lightmode dark:text-foreground-darkmode">
            <Detail features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
        </Slot>

        <Slot name="mobile-search">
          <MobileSearch mapRef={mapRef} mapboxgl={mapboxgl} isGeolocation={isGeolocation} />
        </Slot>

        {/* <Slot
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
        </Slot> */}
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
            areFiltersDefault={combinedFilter.areDefault}
            onResetFiltersClick={combinedFilter.reset}
            mapRef={mapRef}
            yearFilter={yearFilter}
            districtFilter={districtFilter}
            seasonFilter={seasonFilter}
            layerFilter={layerFilter}
            isGeolocation={isGeolocation}
            layerCategories={layerCategories}
            kindFilter={kindFilter}
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
            className={cx(
              "fixed top-0 right-0 w-96 bg-background-lightmode dark:bg-background-darkmode transition-all duration-500",
              {
                "translate-x-full": !isDetailOpen,
                "shadow-lg": isDetailOpen,
              },
            )}
          >
            <Detail features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
        </Slot>
        {/* <Slot name="desktop-legend" isVisible={isLegendVisible} avoidControls={false}>
          <div
            ref={legendRef}
            className={cx(
              "absolute z-50 bottom-[92px] right-[73px] bg-background-lightmode dark:bg-background-darkmode border-2 border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20  transform shadow-lg rounded-lg",
              {
                "scale-0": !isLegendVisible,
              },
            )}
          >
            <h3 className="px-6 pt-6 text-md font-semibold">Legenda</h3>
              <Legend mapCircleColors={{ ...mapCircleColors, "hranica mestskej časti": "#E29F45" }} />
            <DropdownArrow isBottom />
          </div>
        </Slot> */}
      </Layout>
    </Map>
  );
};

export default App;
