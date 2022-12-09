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
import { drinkingFountainsData } from "../data/drinking-fountains";
import { point, featureCollection } from "@turf/helpers";
import { DrinkingFountainMarker } from "./DrinkingFountainMarker";
import { Legend } from "./Legend";
import { BuildingMarker } from "./BuildingMarker";
import { buildingsData } from "../data/buildings";
import { ITerrainService } from "./Layers";
import { terrainServicesLocalDistrictsData } from "../data/terrain-services-local-districts";
import { terrainServicesPointsData } from "../data/terrain-services-points";
import { regions } from "../data/regions";
import { Popup } from "./Popup";

const { data, uniqueDistricts } = processData();
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
    keys: uniqueLayers,
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
        title: "Mestský terénny tím",
        provider: "Magistrát hl. mesta Bratislavy",
        phone: "",
        web: "https://bratislava.sk/socialne-sluzby-a-byvanie/aktivity-v-socialnej-oblasti/mestsky-terenny-tim",
        openingHours: "",
        price: "Zdarma",
        geojson: featureCollection(
          DISTRICTS_GEOJSON.features.filter((feature) => feature.properties.name === "Staré Mesto"),
        ),
      },
      {
        key: "vagus",
        title: "STREETWORK VAGUS",
        provider: "VAGUS o.z.",
        phone: "0949 655 555",
        web: "https://www.vagus.sk/streetwork/2/o-projekte-2/",
        openingHours:
          "denné služby: pondelok až piatok od 8:30 do 12:00; večerné služby: pondelok-sobota od 17:00 do 21:00",
        price: "Zdarma",
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
        title: "TERÉNNA SOCIÁLNA PRÁCA Bl. ROZÁLIE ",
        provider: "DEPAUL Slovensko, n.o.",
        phone: "0910 842 170",
        web: "https://depaul.sk/terenna-praca-bl-rozalie-rendu/",
        openingHours: "pondelok až piatok od 7:30 do 14:00",
        price: "Zdarma",
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
        title: "TERÉNNY PREVENČNÝ TÍM STOPA",
        provider: "STOPA Slovensko o.z.",
        phone: "0948 389 748",
        web: "https://www.stopaslovensko.sk/streetwork/",
        openingHours:
          "pondelok až piatok od 8:00 do 16:00 (počas vyhlásenej zimnej krízy 6:30 - 3:00 druhého dňa)",
        price: "Zdarma",
        geojson: featureCollection([
          ...DISTRICTS_GEOJSON.features.filter((feature) =>
            ["Staré Mesto", "Nové Mesto", "Petržalka"].includes(feature.properties.name),
          ),
          ...terrainServicesLocalDistrictsData.features,
        ]),
      },
      {
        key: "odyseus",
        title:
          "Podpora a poradenstvo  pre ľudí so skúsenosťou s drogami a pracujúcich v sexbiznise",
        provider: "OZ ODYSEUS",
        phone: "0948 619 022",
        web: "https://www.ozodyseus.sk/",
        openingHours:
          "str. 11:30-13:00 Slovnaftská; str. 20:15-21:45 Trnavské mýto; str. 18:45-19:45 Panónska; pia 14:00-15:00 Stavbárska - Pentagon",
        price: "Zdarma",
        geojson: featureCollection([
          ...terrainServicesPointsData.features.filter((feature) =>
            [
              "Slovnaftská ul. (parkovisko pre kamióny)",
              "Trnavské mýto (parkovisko pri Pezinský sud)",
              "Panónska cesta (pri AAA auto)",
              "Stavbárska - Pentagon (pred Centrom K2)",
            ].includes(feature.properties.name),
          ),
        ]),
      },
      {
        key: "prima",
        title:
          "Podpora a poradenstvo  pre ľudí so skúsenosťou s drogami a pracujúcich v sexbiznise",
        provider: "OZ PRIMA",
        phone: "0948 352 330",
        web: "http://primaoz.sk/streetwork/",
        openingHours: "utorok a štvrtok 17:00-21:00; sobota 14:00-17:00",
        price: "Zdarma",
        geojson: featureCollection([
          ...terrainServicesPointsData.features.filter((feature) =>
            ["Parkovisko Slovnaft", "Panónska (parkovisko pri Fiate oproti Citroenu)"].includes(
              feature.properties.name,
            ),
          ),
        ]),
      },
    ],
    [],
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
      mapInformation={{
        title: t("informationModal.title"),
        description: t("informationModal.description"),
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
