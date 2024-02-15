import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import "../styles.css";

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

import { Layer, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";
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

const URL =
  "https://nest-proxy.bratislava.sk/geoportal/hSite/rest/services/Hosted/STROMY_Public/FeatureServer/13";

export const App = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  const [layerCategories, setLayerCategories] = useState<ILayerCategory[]>([]);

  const [data, setData] = useState<FeatureCollection | null>(null);

  const { data: rawData } = useArcgis(URL, {
    pagination: true,
    format: "geojson",
  });

  // USE STATE
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueSeasons, setUniqueSeasons] = useState<string[]>([]);
  const [uniqueKinds, setUniqueKinds] = useState<string[]>([]);
  const [uniqueLayers, setUniqueLayers] = useState<string[]>([]);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isLegendVisible, setLegendVisible] = useState(false);

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

  return (
    <Map
      ref={mapRef}
      minZoom={!isMobile ? 10.8 : 10.4}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={initialViewport}
      isDevelopment={import.meta.env.DEV}
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
            link: "https://nest-proxy.bratislava.sk/geoportal/pfa/apps/sites/#/verejny-mapovy-portal",
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

      <Detail
        isMobile={isMobile ?? false}
        features={selectedFeatures ?? []}
        onClose={closeDetail}
      />

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
