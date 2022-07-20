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
  Marker,
  useCombinedFilter,
  ThemeController,
  ViewportController,
  SlotType,
} from "@bratislava/react-maps-core";
import { DropdownArrow, Sidebar } from "@bratislava/react-maps-ui";
import { useArcgeo } from "@bratislava/react-esri";

// components
import { Detail } from "./Detail";

// layer styles
import ESRI_STYLE from "../assets/layers/esri/esri";
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
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

  const tooltips = {
    orez: "odborný orez dreviny špecifikovaný na základe aktuálneho stavu dreviny alebo dendrologického posudku a zadaný správcom zelene",

    "výrub z rozhodnutia":
      "výrub dreviny na základe rozhodnutia o súhlase s výrubom príslušného orgánu ochrany prírody v zmysle § 47 ods. 3) zákona č. 543/2002",

    "výrub havarijný":
      "výrub z dôvodu bezprostredného ohrozenia zdravia alebo života človeka alebo pri bezprostrednej hrozbe vzniku značnej škode na majetku v zmysle § 47 ods. 4) písm d) zákona č. 543/2002",

    "výrub inváznej dreviny":
      "odstránenie inváznych druhov rastlín výrubom v zmysle § 3 ods. 2) zákona č. 150/2019",

    "injektáž inváznej dreviny":
      "odstránenie inváznych druhov rastlín chemicky - injektážou kmeňov herbicídnym prípravkom v zmysle § 3 ods. 2) zákona č. 150/2019 a vyhlášky č. 450/2019",

    "frézovanie pňov":
      "odstránenie pňa dreviny frézovaním, prípadne iným spôsobom ak frézovanie nie je možné",

    "dendrologický posudok":
      "drevina zhodnotená externým certifikovaným arboristom alebo odborne spôsobilou osobou, pričom sa posudzujú kvantitatívne a kvalitatívne parametre dreviny a na základe vyhodnotenia súčasného stavu sa navrhnú opatrenia na ošetrenie alebo výrub.",

    "odstránenie padnutého stromu":
      "odstránenie stromu a jeho zvyškov, ktorý sa vplyvom počasia alebo na základe skrytých poškodení a hubových ochorení , prípadne vplyvom iných externých činiteľov úplne vyvrátil",

    "manažment imela": "identifikácia imela na drevine a zaradenie do plánu odstraňovania imela",
  };

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
    keepOnEmpty: true,
    keys: uniqueTypes,
    defaultValues: useMemo(
      () => uniqueTypes.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}),
      [uniqueTypes],
    ),
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
        filter: seasonFilter,
        mapToActive: (activeSeasons) => ({
          title: t("filters.season.title"),
          items: activeSeasons.map((activeSeason) => t(`filters.season.seasons.${activeSeason}`)),
        }),
      },
      {
        onlyInExpression: true,
        filter: typeFilter,
        mapToActive: (activeTypes) => ({
          title: t("filters.type.title"),
          items: activeTypes,
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
    if (!isMobile && previousMobile) {
      setLegendVisible((isLegendVisible) => !isLegendVisible);
    }
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

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile
      ? ["legend", "compass", "zoom"]
      : ["legend", "geolocation", "compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#237c36"
      ref={mapRef}
      mapboxgl={mapboxgl}
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

      <Slot name="mobile-controls">
        <ThemeController
          className={cx("fixed left-4 bottom-[88px] sm:bottom-8 sm:transform", {
            "translate-x-96": isSidebarVisible && !isMobile,
          })}
        />
        <ViewportController
          className="fixed right-4 bottom-[88px] sm:bottom-8"
          slots={viewportControllerSlots}
          onLegendClick={onLegendClick}
        />
        <MobileSearch mapRef={mapRef} mapboxgl={mapboxgl} isGeolocation={isGeolocation} />
      </Slot>

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
            typeFilter={typeFilter}
            typeCategories={typeCategories}
            typeTooltips={tooltips}
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
            <Detail arcgeoServerUrl={URL} features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
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
            areFiltersDefault={combinedFilter.areDefault}
            onResetFiltersClick={combinedFilter.reset}
            mapRef={mapRef}
            yearFilter={yearFilter}
            districtFilter={districtFilter}
            seasonFilter={seasonFilter}
            typeFilter={typeFilter}
            isGeolocation={isGeolocation}
            typeCategories={typeCategories}
            typeTooltips={tooltips}
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
            <Detail arcgeoServerUrl={URL} features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
        </Slot>
        <Slot name="desktop-legend" isVisible={isLegendVisible} avoidControls={false}>
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
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
