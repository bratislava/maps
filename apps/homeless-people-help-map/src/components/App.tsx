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

import { Cluster, Filter, Layer, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts";
import TERRAIN_SERVICES_POLYGON_STYLE from "../assets/layers/terrainServicesPolygon";
import TERRAIN_SERVICES_POINT_STYLE from "../assets/layers/terrainServicesPoint";

// utils
import { usePrevious } from "@bratislava/utils";
import { processData } from "../utils/utils";
import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";
import { Point, Feature } from "geojson";
import { IconButton, Modal, Sidebar } from "@bratislava/react-maps-ui";
import { Chevron, Funnel } from "@bratislava/react-maps-icons";
import { Filters } from "./Filters";
import { Detail } from "./Detail";
import { PhoneLinksModal } from "./PhoneLinksModal";
import { Marker } from "./Marker";
import { colors } from "../utils/colors";
import { point, featureCollection } from "@turf/helpers";
import { DrinkingFountainMarker } from "./DrinkingFountainMarker";
import { Legend } from "./Legend";
import { BuildingMarker } from "./BuildingMarker";
import { buildingsData } from "../data/buildings";
import { ITerrainService } from "./Layers";
import { terrainServicesLocalDistrictsData } from "../data/terrain-services-local-districts";
import { regions } from "../data/regions";
import { Popup } from "./Popup";
import { FixpointMarker } from "./FixpointMarker";
import { SyringeExchangeMarker } from "./SyringeExchangeMarker";
import { FixpointAndSyringeExchangeMarker } from "./FixpointAndSyringeExchangeMarker";

const {
  data,
  otherServicesData,
  uniqueDistricts,
  fixpointAndSyringeExchangeData,
  drinkingFountainsData,
} = processData();
const uniqueLayers = Object.keys(colors).filter((key) => key !== "terrainServices");
const defaultLayersValues = uniqueLayers.reduce((prev, curr) => ({ ...prev, [curr]: true }), {});

export const App = () => {
  const { t, i18n } = useTranslation();

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const mapRef = useRef<MapHandle>(null);

  const [selectedMarker, setSelectedMarker] = useState<Feature<Point> | null>(null);

  const [isMobile, setMobile] = useState(false);

  const previousMobile = usePrevious(isMobile);

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

  // fit to district
  useEffect(() => {
    mapRef.current?.fitDistrict(districtFilter.activeKeys);
  }, [districtFilter.activeKeys]);

  // move point to center when selected
  useEffect(() => {
    const MAP = mapRef.current;
    if (MAP && selectedMarker) {
      setTimeout(() => {
        mapRef.current?.moveToFeatures(selectedMarker);
      }, 0);
    }
  }, [selectedMarker]);

  const terrainServices: ITerrainService[] = useMemo(
    () => [
      {
        key: "city-terrain-team",
        title: t("terrainServices.cityTerrainService.title"),
        provider: t("terrainServices.cityTerrainService.provider"),
        phone: t("terrainServices.cityTerrainService.phone"),
        web: "https://bratislava.sk/socialne-sluzby-a-byvanie/aktivity-v-socialnej-oblasti/mestsky-terenny-tim",
        openingHours: t("terrainServices.cityTerrainService.openingHours"),
        price: t("terrainServices.cityTerrainService.price"),
        geojson: featureCollection(
          DISTRICTS_GEOJSON.features.filter((feature) => feature.properties.name === "Staré Mesto"),
        ),
      },
      {
        key: "vagus",
        title: t("terrainServices.vagus.title"),
        provider: t("terrainServices.vagus.provider"),
        phone: t("terrainServices.vagus.phone"),
        web: "https://www.vagus.sk/streetwork/2/o-projekte-2/",
        openingHours: t("terrainServices.vagus.openingHours"),
        price: t("terrainServices.vagus.price"),
        geojson: featureCollection(
          regions.features.filter((feature) =>
            ["Bratislava I", "Bratislava II", "Bratislava III", "Bratislava V"].includes(
              feature.properties?.name,
            ),
          ),
        ),
      },
      {
        key: "rozalie",
        title: t("terrainServices.rozalie.title"),
        provider: t("terrainServices.rozalie.provider"),
        phone: t("terrainServices.rozalie.phone"),
        web: "https://depaul.sk/terenna-praca-bl-rozalie-rendu/",
        openingHours: t("terrainServices.rozalie.openingHours"),
        price: t("terrainServices.rozalie.price"),
        geojson: featureCollection(
          DISTRICTS_GEOJSON.features.filter((feature) =>
            ["Karlova Ves", "Dúbravka", "Lamač", "Devínska Nová Ves"].includes(
              feature.properties.name,
            ),
          ),
        ),
      },
      {
        key: "stopa",
        title: t("terrainServices.stopa.title"),
        provider: t("terrainServices.stopa.provider"),
        phone: t("terrainServices.stopa.phone"),
        web: "https://www.stopaslovensko.sk/streetwork/",
        openingHours: t("terrainServices.stopa.openingHours"),
        price: t("terrainServices.stopa.price"),
        geojson: featureCollection([
          ...DISTRICTS_GEOJSON.features.filter((feature) =>
            ["Staré Mesto", "Nové Mesto", "Petržalka"].includes(feature.properties.name),
          ),
          ...terrainServicesLocalDistrictsData.features,
        ]),
      },
    ],
    [t],
  );

  const [activeTerrainServiceKey, setActiveTerrainServiceKey] = useState<string | null>(null);

  const activeTerrainService = useMemo(() => {
    return terrainServices.find((ts) => ts.key === activeTerrainServiceKey) ?? null;
  }, [terrainServices, activeTerrainServiceKey]);

  const [rememberedActiveLayerKeys, setRememberedActiveLayerKeys] = useState<string[]>([]);

  const handleActiveTerrainServiceChange = useCallback(
    (terrainServiceKey: string | null) => {
      // Close the main detail
      setSelectedMarker(null);
      // Set active terrain key
      setActiveTerrainServiceKey(terrainServiceKey);

      // If enabling some terrain service
      if (terrainServiceKey) {
        // Fit terrain service features
        const features = terrainServices.find((service) => service.key === terrainServiceKey)
          ?.geojson.features;
        features && mapRef.current?.fitFeature(features);

        // Close filters on mobile
        if (isMobile) {
          setSidebarVisible(false);
        }

        if (activeTerrainServiceKey === null) {
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
    [activeTerrainServiceKey, layerFilter, rememberedActiveLayerKeys, terrainServices, isMobile],
  );

  // Disable terrain service if
  useEffect(() => {
    if (layerFilter.activeKeys.length) {
      setActiveTerrainServiceKey(null);
    }
  }, [layerFilter.activeKeys.length]);

  const closeDetail = useCallback(() => {
    setSelectedMarker(null);
    if (activeTerrainServiceKey) {
      handleActiveTerrainServiceChange(null);
    }
  }, [handleActiveTerrainServiceChange, activeTerrainServiceKey]);

  const isDetailVisible = useMemo(() => {
    return (!!selectedMarker || !!activeTerrainServiceKey) && (!isMobile || !isSidebarVisible);
  }, [isMobile, isSidebarVisible, selectedMarker, activeTerrainServiceKey]);

  const { height: viewportControlsHeight = 0, ref: viewportControlsRef } = useResizeDetector();
  const { height: detailHeight = 0, ref: detailRef } = useResizeDetector();

  const { height: windowHeight } = useWindowSize();

  const shouldBeViewportControlsMoved = useMemo(() => {
    return (
      windowHeight < viewportControlsHeight + detailHeight + 40 && !!selectedMarker && !isMobile
    );
  }, [windowHeight, detailHeight, viewportControlsHeight, selectedMarker, isMobile]);

  const [isLegendOpen, setLegendOpen] = useState(false);

  const [isWelcomeModalOpen, setWelcomeModalOpen] = useState(true);

  return (
    <Map
      loadingSpinnerColor="#F1B830"
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      isDevelopment={import.meta.env.DEV}
      onMobileChange={setMobile}
      onMapClick={closeDetail}
      disablePitch
      // disableBearing
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

      {terrainServices.map(({ key, geojson }, index) => (
        <Layer
          key={index}
          geojson={geojson}
          // Style ids have to be unique
          styles={(geojson.features[0]?.geometry.type === "Polygon"
            ? TERRAIN_SERVICES_POLYGON_STYLE
            : TERRAIN_SERVICES_POINT_STYLE
          ).map((style) => ({ ...style, id: `${style.id}-${index}` }))}
          isVisible={key === activeTerrainServiceKey}
          hoverPopup={Popup}
        />
      ))}

      {/* BUILDING MARKERS */}
      {buildingsData.features.map((feature, index) => [
        <BuildingMarker key={index} feature={feature} icon={feature.properties.icon} />,
      ])}

      {/* FIXPOINT AND SYRINGE EXCHANGE MARKERS */}
      <Filter expression={activeTerrainServiceKey ? ["any", false] : districtFilter.expression}>
        {fixpointAndSyringeExchangeData.features.map((feature, index) =>
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

      {/* DRINKING FOUNTAIN MARKERS */}
      <Filter expression={activeTerrainServiceKey ? ["any", false] : districtFilter.expression}>
        <Cluster features={drinkingFountainsData.features} radius={24}>
          {({ features, lng, lat, key, clusterExpansionZoom }) =>
            features.length === 1 ? (
              <DrinkingFountainMarker
                isSelected={!!(selectedMarker && features[0].id === selectedMarker.id)}
                key={key}
                feature={features[0]}
                onClick={() => setSelectedMarker(features[0])}
              />
            ) : (
              <DrinkingFountainMarker
                key={key}
                feature={point([lng, lat], features[0].properties)}
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
            )
          }
        </Cluster>
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

        {otherServicesData?.features.map((feature, index) => (
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
        feature={selectedMarker}
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
          closeButtonIcon={<Chevron className="text-white" direction="right" />}
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
            terrainServices={terrainServices}
            activeTerrainService={activeTerrainServiceKey}
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
            terrainServices={terrainServices}
            activeTerrainService={activeTerrainServiceKey}
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
