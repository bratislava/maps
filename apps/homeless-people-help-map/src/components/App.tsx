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

import { useResizeDetector } from "react-resize-detector";
import { useWindowSize } from "usehooks-ts";

import { Filter, Layer, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts";
import TERRAIN_SERVICES_POINT_STYLE from "../assets/layers/terrainServicesPoint";
import TERRAIN_SERVICES_POLYGON_STYLE from "../assets/layers/terrainServicesPolygon";

// utils
import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";
import { Chevron, Funnel } from "@bratislava/react-maps-icons";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { IconButton, Modal, Sidebar } from "@bratislava/react-maps-ui";
import { isDefined, usePrevious } from "@bratislava/utils";
import { Feature, Point } from "geojson";
import { buildingsData } from "../data/buildings";
import { colors, mainColors } from "../utils/colors";
import { processData } from "../utils/utils";
import { BuildingMarker } from "./BuildingMarker";
import { Detail } from "./Detail";
import { Filters } from "./Filters";
import { FixpointAndSyringeExchangeMarker } from "./FixpointAndSyringeExchangeMarker";
import { FixpointMarker } from "./FixpointMarker";
import { Legend } from "./Legend";
import { Marker } from "./Marker";
import { PhoneLinksModal } from "./PhoneLinksModal";
import { Popup } from "./Popup";
import { SyringeExchangeMarker } from "./SyringeExchangeMarker";
import { useFixpointAndSyringeExchange } from "../data/fixpointAndSyringeExchange";
import { useTerrainServices } from "../data/terrainServices";
import { useServicesData } from "../data/data";
import { ITerrainService } from "../utils/types";

const { uniqueDistricts } = processData();
const uniqueLayers = Object.keys(colors).filter((key) => key !== "terrainServices");
const defaultLayersValues = uniqueLayers.reduce((prev, curr) => ({ ...prev, [curr]: true }), {});

export const App = () => {
  const { t, i18n } = useTranslation();

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const mapRef = useRef<MapHandle>(null);

  const [selectedMarker, setSelectedMarker] = useState<Feature<Point> | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);

  const [isLegendOpen, setLegendOpen] = useState(false);

  const [isWelcomeModalOpen, setWelcomeModalOpen] = useState(true);

  const [isMobile, setMobile] = useState(false);

  const previousMobile = usePrevious(isMobile);

  const { data: fixpointAndSyringeExchangeData } = useFixpointAndSyringeExchange();
  const { dataByService: terrainServices, dataGroupedByRegion } = useTerrainServices();
  const [activeTerrainService, setActiveTerrainService] = useState<ITerrainService | null>(null);

  const { data } = useServicesData();

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  const layerFilter = useFilter({
    property: "subLayerName",
    keys: useMemo(() => [...uniqueLayers], []),
    defaultValues: defaultLayersValues,
  });

  const layerFilterFixedExpression = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = ["any"];
    if (layerFilter.isAnyKeyActive(["counseling"])) result.push(["==", "isCounseling", true]);
    if (layerFilter.isAnyKeyActive(["hygiene"])) result.push(["==", "isHygiene", true]);
    if (layerFilter.isAnyKeyActive(["overnight"])) result.push(["==", "isOvernight", true]);
    if (layerFilter.isAnyKeyActive(["meals"])) result.push(["==", "isMeals", true]);
    if (layerFilter.isAnyKeyActive(["medicalTreatment"]))
      result.push(["==", "isMedicalTreatment", true]);
    if (layerFilter.isAnyKeyActive(["culture"])) result.push(["==", "isCulture", true]);
    if (layerFilter.isAnyKeyActive(["drugsAndSex"])) result.push(["==", "isDrugsAndSex", true]);
    if (layerFilter.isAnyKeyActive(["kolo"])) result.push(["==", "isKolo", true]);
    if (layerFilter.isAnyKeyActive(["notaBene"])) result.push(["==", "isNotaBene", true]);
    return result;
  }, [layerFilter]);

  const combinedFilter = useCombinedFilter({
    combiner: "all",
    filters: [
      {
        filter: districtFilter,
        mapToActive: (activeDistricts) => ({
          title: t("filters.district.title"),
          items: activeDistricts,
        }),
      },
    ],
  });

  const fullFilterExpression = useMemo(() => {
    const e = ["all", layerFilterFixedExpression];
    if (districtFilter.expression.length > 1) e.push(districtFilter.expression);
    return e;
  }, [districtFilter.expression, layerFilterFixedExpression]);

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

  // move point to center when selected
  useEffect(() => {
    const MAP = mapRef.current;
    if (
      MAP &&
      (selectedMarker || selectedFeature || activeTerrainService || districtFilter.activeKeys)
    ) {
      setTimeout(() => {
        if (selectedMarker) {
          mapRef.current?.moveToFeatures(selectedMarker);
        }
        if (selectedFeature) {
          mapRef.current?.moveToFeatures(selectedFeature);
        }
        if (districtFilter.activeKeys) {
          mapRef.current?.fitDistrict(districtFilter.activeKeys);
        }

        if (activeTerrainService) {
          // this needs to wait to not start race condition between opening detail and fitting feature
          // eventually it should be looked into if it is possible to work like moveToFeatures which can handle both opening detail and moveToFeatures
          setTimeout(() => {
            mapRef.current?.fitFeature(activeTerrainService.geojson.features);
          }, 250);
        }
      }, 0);
    }
  }, [selectedMarker, selectedFeature, activeTerrainService, districtFilter.activeKeys]);

  const [rememberedActiveLayerKeys, setRememberedActiveLayerKeys] = useState<string[]>([]);

  const isDetailVisible = useMemo(() => {
    return (
      (!!selectedMarker || !!activeTerrainService || !!selectedFeature) &&
      (!isMobile || !isSidebarVisible)
    );
  }, [selectedMarker, activeTerrainService, selectedFeature, isMobile, isSidebarVisible]);

  const handleActiveTerrainServiceChange = useCallback(
    (terrainService: ITerrainService | null) => {
      // Close the main detail
      setSelectedMarker(null);
      // Set active terrain key
      setActiveTerrainService(terrainService);

      // If enabling some terrain service
      if (terrainService) {
        // Close filters on mobile
        isMobile && setSidebarVisible(false);

        if (!activeTerrainService) {
          // Remember what layers were visible
          setRememberedActiveLayerKeys(layerFilter.activeKeys);
          // Hide all layers
          layerFilter.setActiveAll(false);
        }
      } else {
        // Else if disabling terrain service
        layerFilter.setActiveOnly(rememberedActiveLayerKeys, true);
      }
    },
    [activeTerrainService, layerFilter, rememberedActiveLayerKeys, isMobile],
  );

  useEffect(() => {
    if (!activeTerrainService) {
      layerFilter.setActiveOnly(rememberedActiveLayerKeys, true);
      return;
    }
    // layerFilter is missing in dependencies because it will start rerendering loop
  }, [activeTerrainService, rememberedActiveLayerKeys]);

  useEffect(() => {
    // Close filters on mobile
    isMobile && setSidebarVisible(false);
  }, [isMobile]);

  useEffect(() => {
    if (layerFilter.activeKeys.length) {
      setActiveTerrainService(null);
    }
  }, [layerFilter.activeKeys.length]);

  const closeDetail = useCallback(() => {
    setSelectedMarker(null);
    if (activeTerrainService) {
      handleActiveTerrainServiceChange(null);
    }
    setSelectedFeature(null);
  }, [handleActiveTerrainServiceChange, activeTerrainService]);

  const { height: viewportControlsHeight = 0, ref: viewportControlsRef } = useResizeDetector();
  const { height: detailHeight = 0, ref: detailRef } = useResizeDetector();

  // scroll detail to top when detail is changed
  useEffect(() => {
    detailRef.current?.scrollIntoView();
  }, [detailRef, selectedMarker, selectedFeature]);

  const { height: windowHeight } = useWindowSize();

  const shouldBeViewportControlsMoved = useMemo(() => {
    return (
      windowHeight < viewportControlsHeight + detailHeight + 40 &&
      (!!selectedMarker || !!selectedFeature || !!activeTerrainService) &&
      !isMobile
    );
  }, [
    windowHeight,
    viewportControlsHeight,
    detailHeight,
    selectedMarker,
    selectedFeature,
    activeTerrainService,
    isMobile,
  ]);

  const onFeaturesClick = useCallback((features: MapboxGeoJSONFeature[]) => {
    setSelectedFeature(features[0] ?? null);
    setSelectedMarker(null);
    setActiveTerrainService(null);
  }, []);

  return (
    <Map
      loadingSpinnerColor={mainColors.yellow}
      ref={mapRef}
      minZoom={!isMobile ? 10.8 : 10.4}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      isDevelopment={import.meta.env.DEV}
      onMobileChange={setMobile}
      onMapClick={closeDetail}
      onFeaturesClick={onFeaturesClick}
      mapInformation={{
        title: t("informationModal.title"),
        description: (
          <Trans i18nKey="informationModal.description">
            before
            <a href={t("informationModal.descriptionLink")} className="underline font-semibold">
              link
            </a>
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
      <Layer
        ignoreClick
        filters={districtFilter.keepOnEmptyExpression}
        geojson={DISTRICTS_GEOJSON}
        styles={DISTRICTS_STYLE}
      />

      {terrainServices?.map(({ key, geojson }, index) => {
        return (
          <Layer
            ignoreClick
            key={index}
            geojson={geojson}
            // Style ids have to be unique
            styles={(geojson.features[0]?.geometry.type === "Polygon"
              ? TERRAIN_SERVICES_POLYGON_STYLE
              : TERRAIN_SERVICES_POINT_STYLE
            ).map((style) => ({ ...style, id: `terrainServices-${style.id}-${index}` }))}
            isVisible={key === activeTerrainService?.key}
            hoverPopup={Popup}
          />
        );
      })}
      {dataGroupedByRegion?.map((feature, index) => {
        return (
          <Layer
            key={feature.id + "3000" ?? index + 3000}
            geojson={feature}
            // Style ids have to be unique
            styles={(feature.geometry.type === "Polygon"
              ? TERRAIN_SERVICES_POLYGON_STYLE
              : TERRAIN_SERVICES_POINT_STYLE
            ).map((style) => ({ ...style, id: `${style.id}-${index}` }))}
            isVisible={!activeTerrainService}
            hidePopup={feature.properties.name !== selectedFeature?.properties?.name}
            hoverPopup={
              <Popup
                name={feature.properties.name}
                terrainServices={feature.properties.terrainServices
                  ?.map((terrainService) => terrainService.title)
                  .filter(isDefined)}
              />
            }
          />
        );
      })}

      {/* BUILDING MARKERS */}
      {buildingsData.features.map((feature, index) => [
        <BuildingMarker key={index} feature={feature} icon={feature.properties.icon} />,
      ])}

      {/* FIXPOINT AND SYRINGE EXCHANGE MARKERS  TODO CONTINUE HERE*/}
      <Filter expression={activeTerrainService?.key ? ["any", false] : districtFilter.expression}>
        {fixpointAndSyringeExchangeData?.features.map((feature, index) =>
          feature.properties?.icon === "fixpoint" ? (
            <FixpointMarker
              isSelected={!!(selectedMarker && feature.id === selectedMarker.id)}
              key={index}
              feature={feature}
              onClick={() => setSelectedMarker(feature)}
            />
          ) : feature.properties?.icon === "syringeExchange" ? (
            <SyringeExchangeMarker
              isSelected={!!(selectedMarker && feature.id === selectedMarker.id)}
              key={index}
              feature={feature}
              onClick={() => setSelectedMarker(feature)}
            />
          ) : (
            <FixpointAndSyringeExchangeMarker
              isSelected={!!(selectedMarker && feature.id === selectedMarker.id)}
              key={index}
              feature={feature}
              onClick={() => setSelectedMarker(feature)}
            />
          ),
        )}
      </Filter>

      <Filter expression={fullFilterExpression}>
        {data?.features.map((feature, index) => (
          <Marker
            key={index}
            feature={feature}
            onClick={() => setSelectedMarker(feature)}
            activeKeys={layerFilter.activeKeys}
            isSelected={selectedMarker?.id === feature.id}
          />
        ))}
      </Filter>

      <Detail
        ref={detailRef}
        isVisible={isDetailVisible}
        isMobile={isMobile}
        feature={selectedMarker ?? selectedFeature}
        activeTerrainService={activeTerrainService}
        onClose={closeDetail}
      />

      <Slot
        id="controls"
        position="bottom"
        className="p-4 pb-9 flex flex-col gap-2 w-screen pointer-events-none"
      >
        <div className="flex justify-between items-end">
          <ThemeController
            className={cx("pointer-events-auto", {
              "translate-x-96": isSidebarVisible && !isMobile,
              "translate-x-0": !(isSidebarVisible && !isMobile),
            })}
          />
          <div
            ref={viewportControlsRef}
            className={cx("flex items-end gap-2 transition-transform duration-500", {
              "-translate-x-96": shouldBeViewportControlsMoved,
              "translate-x-0": !shouldBeViewportControlsMoved,
            })}
          >
            <PhoneLinksModal className="pointer-events-auto hidden sm:flex" />
            <ViewportController
              slots={["legend", ["compass", "zoom"]]}
              desktopSlots={["legend", "geolocation", "compass", ["fullscreen", "zoom"]]}
              isLegendOpen={isLegendOpen}
              onLegendOpenChange={setLegendOpen}
            />
          </div>
        </div>
        <div className="pointer-events-auto shadow-lg rounded-lg sm:hidden">
          <SearchBar placeholder={t("search")} language={i18n.language} direction="top" />
        </div>
      </Slot>

      <Slot id="welcome-modal">
        <Modal
          overlayClassName="max-w-lg"
          title={t("welcomeModal.title")}
          isOpen={isWelcomeModalOpen}
          onClose={() => setWelcomeModalOpen(false)}
          closeButtonIcon={<Chevron direction="right" />}
        >
          <div className="pb-4">{t("welcomeModal.description")}</div>
        </Modal>
      </Slot>

      <Layout isOnlyMobile>
        <Slot id="mobile-header" position="top-right">
          <div className="p-4 flex gap-4">
            <PhoneLinksModal />
            <IconButton className="shrink-0" onClick={() => setSidebarVisible(true)}>
              <Funnel size="md" />
            </IconButton>
          </div>
        </Slot>

        <Slot id="mobile-filter" isVisible={isSidebarVisible} position="top-left">
          <Filters
            isMobile
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            activeFilters={combinedFilter.active}
            onResetFiltersClick={combinedFilter.reset}
            districtFilter={districtFilter}
            layerFilter={layerFilter}
            terrainServices={terrainServices || []}
            activeTerrainService={activeTerrainService?.key || null}
            onActiveTerrainServiceChange={handleActiveTerrainServiceChange}
          />
        </Slot>

        <Slot isVisible={isLegendOpen} id="mobile-legend" position="top-right">
          <Sidebar
            position="right"
            title={t("legend.title")}
            isVisible={isLegendOpen}
            isMobile
            onOpen={() => setSidebarVisible(true)}
            onClose={() => setLegendOpen(false)}
            closeText={t("close")}
          >
            <div className="p-6">
              <Legend />
            </div>
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
          <Filters
            isMobile={false}
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            onResetFiltersClick={combinedFilter.reset}
            districtFilter={districtFilter}
            activeFilters={combinedFilter.active}
            layerFilter={layerFilter}
            terrainServices={terrainServices || []}
            activeTerrainService={activeTerrainService?.key || null}
            onActiveTerrainServiceChange={handleActiveTerrainServiceChange}
          />
        </Slot>

        <Slot id="desktop-legend">
          <Modal
            closeButtonInCorner
            title={t("legend.title")}
            isOpen={isLegendOpen}
            onClose={() => setLegendOpen(false)}
          >
            <Legend />
          </Modal>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
