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

import {
  Cluster,
  Filter,
  Layer,
  useCombinedFilter,
  useFilter,
  useMarkerOrFeaturesInQuery,
} from "@bratislava/react-mapbox";
import { featureCollection } from "@turf/helpers";

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
import { DrinkingFountainMarker } from "./DrinkingFountainMarker";
import { useDrinkingFountains } from "../data/drinkingFountains";

const { uniqueDistricts } = processData();
const uniqueLayers = Object.keys(colors).filter((key) => key !== "terrainServices");
const defaultLayersValues = uniqueLayers.reduce((prev, curr) => ({ ...prev, [curr]: true }), {});

export const App = () => {
  const { t, i18n } = useTranslation();

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isSidebarClosedByUser, setSidebarClosedByUser] = useState(false);
  const [shouldAutomaticallyToggleSideBar, setAutomaticallyToggleSideBar] =
    useState<boolean>(false);

  const mapRef = useRef<MapHandle>(null);
  // TODO refactor this, why is there 3 different states for selected feature/marker
  const [selectedMarker, setSelectedMarker] = useState<Feature<Point> | null>(null);
  // terrain services are located in sidebar
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  // grouped terrain services are shown on map
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);

  const [isLegendOpen, setLegendOpen] = useState(false);

  const [isWelcomeModalOpen, setWelcomeModalOpen] = useState(true);

  const [isMobile, setMobile] = useState(false);

  const previousMobile = usePrevious(isMobile);

  const { data: fixpointAndSyringeExchangeData } = useFixpointAndSyringeExchange();
  const { data: drinkingFountainsData } = useDrinkingFountains();
  const { dataByService: terrainServices, dataGroupedByRegion: terrainServicesGroupedByRegion } =
    useTerrainServices();
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
    return result;
  }, [layerFilter]);

  // this is needed to update selectedFeatures when selectedFeature is changed
  // this is needed because of unnecessary rerendering useMarkerOrFeaturesInQuery which causes multiple query parameters to appear
  // lazy solution without diving too deep into logic
  useEffect(() => {
    setSelectedFeatures(selectedFeature ? [selectedFeature] : []);
  }, [selectedFeature]);

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

  useMarkerOrFeaturesInQuery({
    markersData: featureCollection(terrainServicesGroupedByRegion ?? []),
    selectedFeatures: selectedFeatures,
    setSelectedFeaturesAndZoom: (features) => {
      // frameState is not set in the beginning - setTimeout as a lazy solution
      setTimeout(() => {
        setSelectedFeature((features && features[0]) || null);
      }, 500);
    },
  });
  useMarkerOrFeaturesInQuery({
    markersData: data ?? null,
    selectedMarker: selectedMarker,
    setSelectedMarkerAndZoom: (marker) => {
      // frameState is not set in the beginning - setTimeout as a lazy solution
      setTimeout(() => {
        setSelectedMarker(marker);
      }, 500);
    },
  });

  // close sidebar on mobile and open on desktop
  useEffect(() => {
    // from mobile to desktop
    if (previousMobile && !isMobile) {
      setSidebarVisible(true);
    }
    // from desktop to mobile
    if (!previousMobile && isMobile) {
      setSidebarVisible(false);
    }
  }, [previousMobile, isMobile]);

  useEffect(() => {
    // if in iframe or mobile, close sidebar automatically
    window === window.parent || isMobile
      ? setAutomaticallyToggleSideBar(false)
      : setAutomaticallyToggleSideBar(true);
  }, [isMobile]);

  // automatic sidebar toggling
  useEffect(() => {
    if (shouldAutomaticallyToggleSideBar && !isSidebarClosedByUser) {
      if (selectedMarker || selectedFeature || activeTerrainService) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    }
  }, [
    selectedMarker,
    selectedFeature,
    activeTerrainService,
    shouldAutomaticallyToggleSideBar,
    isSidebarClosedByUser,
  ]);

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
          setTimeout(() => {
            mapRef.current?.fitDistrict(selectedFeature.properties?.district);
          }, 250);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onFeaturesClick = useCallback(
    (features: MapboxGeoJSONFeature[]) => {
      // features from args has properties in json format, thats why we use features from original source
      const selectedFeatureFromOriginalSource =
        features &&
        features[0] &&
        terrainServicesGroupedByRegion?.find((t) => t.id === features[0].id);
      setSelectedFeature(selectedFeatureFromOriginalSource ?? null);
      setSelectedMarker(null);
      setActiveTerrainService(null);
    },
    [terrainServicesGroupedByRegion],
  );

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
      {/* terrain services located in sidebar, they are not shown until selected in sidebar  */}
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
            hoverPopup={(name) => <Popup name={name} />}
          />
        );
      })}
      {terrainServicesGroupedByRegion?.map((feature, index) => {
        return (
          <Layer
            key={feature.id + "3000"}
            geojson={feature}
            // Style ids have to be unique
            styles={(feature.geometry.type === "Polygon"
              ? TERRAIN_SERVICES_POLYGON_STYLE
              : TERRAIN_SERVICES_POINT_STYLE
            ).map((style) => ({ ...style, id: `${style.id}-${index}` }))}
            isVisible={!activeTerrainService}
            hidePopup={feature.properties.name !== selectedFeature?.properties?.name}
            hoverPopup={
              isMobile ? null : (
                <Popup
                  name={feature.properties.name}
                  terrainServices={feature.properties.terrainServices
                    ?.map((terrainService) => terrainService.title)
                    .filter(isDefined)}
                />
              )
            }
          />
        );
      })}

      {/* BUILDING MARKERS */}
      {buildingsData.features.map((feature, index) => [
        <BuildingMarker key={index} feature={feature} icon={feature.properties.icon} />,
      ])}
      {/* DRINKING FOUNTAIN MARKERS */}
      <Cluster features={drinkingFountainsData?.features ?? []} radius={24}>
        {({ features, lng, lat, key, clusterExpansionZoom }) => {
          return features.length === 1 ? (
            <DrinkingFountainMarker
              key={key}
              feature={features[0]}
              isSelected={selectedFeature?.id === features[0].properties?.id}
              onClick={(feature) => setSelectedMarker(feature)}
            />
          ) : (
            <DrinkingFountainMarker
              key={key}
              feature={{
                ...features[0],
                geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
              }}
              count={features.length}
              onClick={() =>
                mapRef.current?.changeViewport({
                  zoom: clusterExpansionZoom ?? 0,
                  center: {
                    lat,
                    lng,
                  },
                })
              }
            />
          );
        }}
      </Cluster>

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
            setVisible={(isVisible) => setSidebarVisible(isVisible)}
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
            setVisible={(isVisible) => {
              setSidebarClosedByUser(!isVisible);
              setSidebarVisible(isVisible);
            }}
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
