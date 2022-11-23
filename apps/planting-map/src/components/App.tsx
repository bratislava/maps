import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useResizeDetector } from "react-resize-detector";
import "../styles.css";
import { point } from "@turf/helpers";

// maps
import {
  Layout,
  Map,
  MapHandle,
  SearchBar,
  Slot,
  ThemeController,
  ViewportController,
} from "@bratislava/react-maps";

import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";

import { Layer, Marker, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";
import { useArcgis } from "@bratislava/react-use-arcgis";

// components
import { Detail } from "./Detail";

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts/districts";
import ESRI_STYLE from "../assets/layers/esri/esri";

// utils
import { Modal, Sidebar } from "@bratislava/react-maps-ui";
import { usePrevious } from "@bratislava/utils";
import { FeatureCollection } from "geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { processData, treeKindNameSkMappingObject } from "../utils/utils";
import { DesktopFilters } from "./desktop/DesktopFilters";
import { ILayerCategory } from "./Layers";
import { Legend } from "./Legend";
import { MobileFilters } from "./mobile/MobileFilters";
import { MobileHeader } from "./mobile/MobileHeader";

const URL = "https://geoportal.bratislava.sk/hsite/rest/services/zp/STROMY/MapServer/0";

export const App = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  const [layerCategories, setLayerCategories] = useState<ILayerCategory[]>([]);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);

  const { data: rawData } = useArcgis(URL, { pagination: false, format: "geojson" });

  // USE STATE
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueSeasons, setUniqueSeasons] = useState<string[]>([]);
  const [uniqueKinds, setUniqueKinds] = useState<string[]>([]);
  const [uniqueLayers, setUniqueLayers] = useState<string[]>([]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);
  const [isLegendVisible, setLegendVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (rawData) {
      const { data, uniqueYears, uniqueKinds, uniqueDistricts, uniqueSeasons } =
        processData(rawData);

      setData(data);
      setUniqueYears(uniqueYears);
      setUniqueDistricts(uniqueDistricts);
      setUniqueSeasons(uniqueSeasons);
      setUniqueKinds(uniqueKinds);
      setUniqueLayers(["planting", "replacement-planting"]);

      setLayerCategories([
        {
          label: t("layers.planting"),
          subLayers: ["planting"],
        },
        {
          label: t("layers.replacementPlanting"),
          subLayers: ["replacement-planting"],
        },
      ]);
      setLoading(false);
    }
  }, [rawData, t]);

  const mapRef = useRef<MapHandle>(null);

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);
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

  const layerFilter = useFilter({
    property: "layer",
    keys: uniqueLayers,
    defaultValues: useMemo(
      () => uniqueLayers.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}),
      [uniqueLayers],
    ),
  });

  const kindFilter = useFilter({
    property: "kindSimple",
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
      {
        onlyInExpression: true,
        filter: layerFilter,
        mapToActive: (activeLayers) => ({
          title: "Layers",
          items: activeLayers,
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

  const selectedFeatures = useMemo(() => {
    return selectedFeature ? [selectedFeature] : [];
  }, [selectedFeature]);

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

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#237c36"
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={initialViewport}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      onFeaturesClick={(features) => setSelectedFeature(features[0])}
      selectedFeatures={selectedFeatures}
      onMobileChange={setMobile}
      onMapClick={closeDetail}
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
      <Layer filters={combinedFilter.expression} geojson={data} styles={ESRI_STYLE} />
      <Layer
        ignoreClick
        filters={districtFilter.expression}
        geojson={DISTRICTS_GEOJSON}
        styles={DISTRICTS_STYLE}
      />

      {!!selectedFeatures?.length && selectedFeatures[0].geometry.type === "Point" && (
        <Marker feature={point(selectedFeatures[0].geometry.coordinates)} isRelativeToZoom>
          <div
            className="w-4 h-4 bg-background-lightmode dark:bg-background-darkmode border-[2px] rounded-full"
            style={{ borderColor: selectedFeatures[0].properties?.["color"] }}
          ></div>
        </Marker>
      )}

      <Slot id="controls">
        <ThemeController
          className={cx("fixed left-4 bottom-[88px] sm:bottom-8 sm:transform", {
            "translate-x-96": isSidebarVisible && !isMobile,
          })}
        />
        <ViewportController
          className="fixed right-4 bottom-[88px] sm:bottom-8"
          onLegendOpenChange={setLegendVisible}
          isLegendOpen={isLegendVisible}
          slots={["legend", "compass", "zoom"]}
          desktopSlots={["legend", "geolocation", "compass", ["fullscreen", "zoom"]]}
        />

        <div className="fixed bottom-8 left-4 right-4 z-10 shadow-lg rounded-lg sm:hidden">
          <SearchBar placeholder={t("search")} language={i18n.language} direction="top" />
        </div>
      </Slot>

      <Layout isOnlyMobile>
        <Slot id="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>

        <Slot id="mobile-filter" isVisible={isSidebarVisible} position="top-right">
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
          id="mobile-detail"
          isVisible={isDetailOpen}
          padding={{
            bottom: window.innerHeight / 2, // w-96 or 24rem
          }}
        >
          <Detail isMobile features={selectedFeatures ?? []} onClose={closeDetail} />
        </Slot>

        <Slot id="mobile-legend" isVisible={isLegendVisible} position="top-right">
          <Sidebar
            title={t("title")}
            isVisible={isLegendVisible ?? false}
            onOpen={() => setLegendVisible(true)}
            onClose={() => setLegendVisible(false)}
            position="right"
            closeText={t("close")}
          >
            <Legend />
          </Sidebar>
        </Slot>
      </Layout>

      <Layout isOnlyDesktop>
        <Slot id="desktop-filters" isVisible={isSidebarVisible} position="top-left" autoPadding>
          <DesktopFilters
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            onResetFiltersClick={combinedFilter.reset}
            yearFilter={yearFilter}
            districtFilter={districtFilter}
            seasonFilter={seasonFilter}
            layerFilter={layerFilter}
            layerCategories={layerCategories}
            kindFilter={kindFilter}
            filters={combinedFilter.expression}
          />
        </Slot>

        <Slot
          id="desktop-detail"
          isVisible={isDetailOpen}
          position="top-right"
          autoPadding
          avoidMapboxControls={
            window.innerHeight <= (desktopDetailHeight ?? 0) + 200 ? true : false
          }
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
            <Detail isMobile={false} features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
        </Slot>
        <Slot id="desktop-legend">
          <Modal
            closeButtonInCorner
            title={t("legend.title")}
            isOpen={isLegendVisible ?? false}
            onClose={() => setLegendVisible(false)}
          >
            <Legend />
          </Modal>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
