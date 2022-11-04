import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useResizeDetector } from "react-resize-detector";
import "../styles.css";
import { useWindowSize } from "usehooks-ts";

// maps
import { Layer, Marker, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";
import {
  Layout,
  Map,
  MapHandle,
  SearchBar,
  Slot,
  SlotType,
  ThemeController,
  ViewportController,
} from "@bratislava/react-maps";
import { Sidebar } from "@bratislava/react-maps-ui";
import { useArcgis } from "@bratislava/react-use-arcgis";

// components
import { Detail } from "./Detail";

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts/districts";
import ESRI_STYLE from "../assets/layers/esri/esri";

// utils
import { usePrevious } from "@bratislava/utils";
import { FeatureCollection } from "geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { mapCircleColors, processData } from "../utils/utils";
import { DesktopFilters } from "./desktop/DesktopFilters";
import { Legend } from "./Legend";
import { MobileFilters } from "./mobile/MobileFilters";
import { MobileHeader } from "./mobile/MobileHeader";

import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";

const URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/ArcGIS/rest/services/orezy_a_vyruby_2022_OTMZ_zobrazenie/FeatureServer/0";

export const App = () => {
  const { t, i18n } = useTranslation();

  const [typeCategories, setTypeCategories] = useState<
    {
      label: string;
      types: string[];
    }[]
  >([]);

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);

  const { data: rawData } = useArcgis(URL);
  // USE STATE
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueSeasons, setUniqueSeasons] = useState<string[]>([]);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);
  const [isLegendVisible, setLegendVisible] = useState(false);

  const tooltips = {
    trimming:
      "odborný orez dreviny špecifikovaný na základe aktuálneho stavu dreviny alebo dendrologického posudku a zadaný správcom zelene",

    fellingByPermit:
      "výrub dreviny na základe rozhodnutia o súhlase s výrubom príslušného orgánu ochrany prírody v zmysle § 47 ods. 3) zákona č. 543/2002",

    emergencyFelling:
      "výrub z dôvodu bezprostredného ohrozenia zdravia alebo života človeka alebo pri bezprostrednej hrozbe vzniku značnej škode na majetku v zmysle § 47 ods. 4) písm d) zákona č. 543/2002",

    invasivePlantsFelling:
      "odstránenie inváznych druhov rastlín výrubom v zmysle § 3 ods. 2) zákona č. 150/2019",

    injectionOfInvasivePlants:
      "odstránenie inváznych druhov rastlín chemicky - injektážou kmeňov herbicídnym prípravkom v zmysle § 3 ods. 2) zákona č. 150/2019 a vyhlášky č. 450/2019",

    stumpRemoval:
      "odstránenie pňa dreviny frézovaním, prípadne iným spôsobom ak frézovanie nie je možné",

    dendrologicalAssessment:
      "drevina zhodnotená externým certifikovaným arboristom alebo odborne spôsobilou osobou, pričom sa posudzujú kvantitatívne a kvalitatívne parametre dreviny a na základe vyhodnotenia súčasného stavu sa navrhnú opatrenia na ošetrenie alebo výrub.",

    fallenTreeRemoval:
      "odstránenie stromu a jeho zvyškov, ktorý sa vplyvom počasia alebo na základe skrytých poškodení a hubových ochorení , prípadne vplyvom iných externých činiteľov úplne vyvrátil",

    mistletoeManagement: "identifikácia imela na drevine a zaradenie do plánu odstraňovania imela",
  };

  useEffect(() => {
    if (rawData) {
      const knownCategories = [
        {
          label: t("categories.felling"),
          types: ["fellingByPermit", "emergencyFelling", "invasivePlantsFelling"],
        },
        {
          label: t("categories.trimming"),
          types: ["trimming"],
        },
        {
          label: t("categories.invasivePlants"),
          types: ["injectionOfInvasivePlants", "invasivePlantsFelling"],
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
          label: t("categories.others"),
          types: otherTypes,
        },
      ]);
      setLoading(false);
    }
  }, [rawData, t]);

  const mapRef = useRef<MapHandle>(null);

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>();
  const [isMobile, setMobile] = useState<boolean | null>(null);

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
    setSelectedFeature(null);
  }, []);

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

  const isDetailOpen = useMemo(() => !!selectedFeature, [selectedFeature]);

  // fit to district
  useEffect(() => {
    mapRef.current?.fitDistrict(districtFilter.activeKeys);
  }, [districtFilter.activeKeys]);

  // move point to center when selected
  useEffect(() => {
    const MAP = mapRef.current;
    if (MAP && selectedFeature) {
      setTimeout(() => {
        if (selectedFeature.geometry.type === "Point") {
          mapRef.current?.changeViewport({
            center: {
              lng: selectedFeature.geometry.coordinates[0],
              lat: selectedFeature.geometry.coordinates[1],
            },
          });
        }
      }, 0);
    }
  }, [selectedFeature]);

  const { height: desktopDetailHeight, ref: desktopDetailRef } =
    useResizeDetector<HTMLDivElement>();

  const initialViewport = useMemo(
    () => ({
      zoom: 12.229005488986582,
      center: {
        lat: 48.148598,
        lng: 17.107748,
      },
    }),
    [],
  );

  const mapStyles = useMemo(
    () => ({
      light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
      dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
    }),
    [],
  );

  const onFeaturesClick = useCallback((features: MapboxGeoJSONFeature[]) => {
    mapRef.current?.moveToFeatures(features);
    setSelectedFeature(features[0] ?? null);
  }, []);

  const selectedFeatures = useMemo(() => {
    return selectedFeature ? [selectedFeature] : [];
  }, [selectedFeature]);

  const { height: windowHeight } = useWindowSize();

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#237c36"
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={mapStyles}
      initialViewport={initialViewport}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      onMapClick={closeDetail}
      selectedFeatures={selectedFeatures}
      onFeaturesClick={onFeaturesClick}
      onMobileChange={setMobile}
      mapInformation={{
        title: t("informationModal.title"),
        description: (
          <Trans i18nKey="informationModal.description">
            before
            <a
              className="underline text-secondary font-semibold"
              href={t("informationModal.descriptionLink")}
              target="_blank"
              rel="noreferrer"
            >
              link
            </a>
            after
          </Trans>
        ),
        partners: [
          {
            name: "bratislava",
            link: "https://bratislava.sk",
            image: "logos/bratislava.png",
          },
          {
            name: "inovation",
            link: "https://inovacie.bratislava.sk/",
            image: "logos/inovation.png",
          },
          {
            name: "geoportal",
            link: "https://geoportal.bratislava.sk/pfa/apps/sites/#/verejny-mapovy-portal",
            image: "logos/geoportal.png",
          },
        ],
        footer: (
          <Trans i18nKey="informationModal.footer">
            before
            <a href={t("informationModal.footerLink")} className="underline font-semibold">
              link
            </a>
          </Trans>
        ),
      }}
    >
      <Layer filters={combinedFilter.expression} isVisible geojson={data} styles={ESRI_STYLE} />
      <Layer
        ignoreClick
        filters={districtFilter.expression}
        geojson={DISTRICTS_GEOJSON}
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
            className="w-4 h-4 bg-background-lightmode dark:bg-background-darkmode border-[2px] rounded-full"
            style={{ borderColor: selectedFeatures[0].properties?.["color"] }}
          ></div>
        </Marker>
      )}

      <Slot
        id="controls"
        position="bottom"
        className="p-4 pb-9 flex flex-col gap-2 w-screen pointer-events-none"
      >
        <div className="flex justify-between items-end">
          <ThemeController
            className={cx("pointer-events-auto", {
              "translate-x-96 delay-75": isSidebarVisible && !isMobile,
              "translate-x-0 delay-200": !(isSidebarVisible && !isMobile),
            })}
          />
          <div
          // ref={viewportControlsRef}
          >
            <ViewportController
              className={cx({
                // "-translate-x-96": shouldBeViewportControlsMoved,
                // "translate-x-0": !shouldBeViewportControlsMoved,
              })}
              slots={["legend", ["compass", "zoom"]]}
              desktopSlots={["legend", "geolocation", "compass", ["fullscreen", "zoom"]]}
              legend={
                <Legend mapCircleColors={{ ...mapCircleColors, districtBorder: "#E29F45" }} />
              }
              isLegendOpen={isLegendVisible}
              onLegendOpenChange={setLegendVisible}
            />
          </div>
        </div>
        <div className="pointer-events-auto shadow-lg rounded-lg sm:hidden">
          <SearchBar placeholder={t("search")} language={i18n.language} direction="top" />
        </div>
      </Slot>

      <Layout isOnlyMobile>
        <Slot id="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>

        <Slot id="mobile-filter" isVisible={isSidebarVisible} position="top-left">
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

        <Slot id="mobile-detail" isVisible={isDetailOpen} position="bottom">
          <div className="h-full bg-background-lightmode dark:bg-background-darkmode text-foreground-lightmode dark:text-foreground-darkmode">
            <Detail
              isMobile
              arcgisServerUrl={URL}
              features={selectedFeatures ?? []}
              onClose={closeDetail}
            />
          </div>
        </Slot>

        <Slot id="mobile-legend" isVisible={isLegendVisible} position="top-right">
          <Sidebar
            title={t("title")}
            isVisible={isLegendVisible ?? false}
            onClose={() => setLegendVisible(false)}
            onOpen={() => setLegendVisible(true)}
            position="right"
            closeText={t("close")}
          >
            <Legend mapCircleColors={{ ...mapCircleColors, districtBorder: "#E29F45" }} />
          </Sidebar>
        </Slot>
      </Layout>

      <Layout isOnlyDesktop>
        <Slot
          id="desktop-filters"
          isVisible={isSidebarVisible}
          position="top-left"
          autoPadding
          avoidMapboxControls
        >
          <DesktopFilters
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
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
          id="desktop-detail"
          isVisible={isDetailOpen}
          position="top-right"
          autoPadding
          avoidMapboxControls={windowHeight <= (desktopDetailHeight ?? 0) + 200 ? true : false}
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
            <Detail
              isMobile={false}
              arcgisServerUrl={URL}
              features={selectedFeatures ?? []}
              onClose={closeDetail}
            />
          </div>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
