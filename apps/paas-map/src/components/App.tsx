import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "../styles.css";
import { useResizeDetector } from "react-resize-detector";
import udrStyles from "../data/udr/udr";
import odpStyles from "../data/odp/odp";

// maps
import {
  usePrevious,
  Slot,
  Layout,
  MapHandle,
  Map,
  Cluster,
  Filter,
  ThemeController,
  ViewportController,
  useFilter,
  Layer,
  SlotType,
} from "@bratislava/react-maps-core";

// components
import { Detail } from "./Detail";

// utils
import { getProcessedData } from "../utils/utils";
import mapboxgl from "mapbox-gl";
import { Feature, Point, FeatureCollection } from "geojson";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileSearch } from "./mobile/MobileSearch";

import { Marker } from "./Marker";
import { DesktopFilters } from "./desktop/DesktopFilters";
import { ILayerGroup } from "@bratislava/react-maps-ui";
import { Icon } from "./Icon";

export const App = () => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [markersData, setMarkersData] = useState<FeatureCollection | null>(null);
  const [udrData, setUdrData] = useState<FeatureCollection | null>(null);
  const [odpData, setOdpData] = useState<FeatureCollection | null>(null);
  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const { markersData, udrData, odpData } = getProcessedData();
    setMarkersData(markersData);
    setUdrData(udrData);
    setOdpData(odpData);
    setLoading(false);
  }, []);

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);
  const [isGeolocation, setGeolocation] = useState(false);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const layerFilter = useFilter({
    property: "layer",
    keepOnEmpty: true,
    keys: useMemo(() => ["visitors", "residents"], []),
    defaultValues: useMemo(
      () => ({
        visitors: false,
        residents: false,
      }),
      [],
    ),
  });

  const layerGroups: ILayerGroup<typeof layerFilter.keys[0]>[] = useMemo(
    () => [
      {
        label: t(`layers.visitors.title`),
        icon: <Icon icon="visitor" size={48} />,
        layers: {
          value: "visitors",
          label: t(`layers.visitors.title`),
          isActive: layerFilter.isAnyKeyActive(["visitors"]),
        },
      },
      {
        label: t(`layers.residents.title`),
        icon: <Icon icon="resident" size={48} />,
        layers: {
          value: "residents",
          label: t(`layers.residents.title`),
          isActive: layerFilter.isAnyKeyActive(["residents"]),
        },
      },
    ],
    [layerFilter, t],
  );

  const previousLayerFilterActiveKeys = usePrevious(layerFilter.activeKeys);

  const markerFilter = useFilter({
    property: "kind",
    keepOnEmpty: true,
    keys: useMemo(
      () => [
        "assistants",
        "branches",
        "parkomats",
        "partners",
        "garages",
        "p-plus-r",
        "p-plus-r-region",
      ],
      [],
    ),
    defaultValues: useMemo(
      () => ({
        assistants: false,
        branches: false,
        parkomats: false,
        partners: false,
        garages: false,
        "p-plus-r": false,
        "p-plus-r-region": false,
      }),
      [],
    ),
  });

  const setActiveOnlyVisitorLayers = useCallback(() => {
    layerFilter.setActiveOnly(["visitors"], true);
    markerFilter.setActiveOnly([
      "assistants",
      "partners",
      "parkomats",
      "garages",
      "p-plus-r",
      "p-plus-r-region",
    ]);
  }, [layerFilter, markerFilter]);

  const setActiveOnlyResidentLayers = useCallback(() => {
    layerFilter.setActiveOnly(["residents"], true);
    markerFilter.setActiveOnly(["branches", "garages", "p-plus-r", "p-plus-r-region"]);
  }, [layerFilter, markerFilter]);

  // make sure only one layer is selected
  useEffect(() => {
    if (
      layerFilter.activeKeys.length === 1 ||
      previousLayerFilterActiveKeys?.length === layerFilter.activeKeys.length
    )
      return;

    // after clicking hide
    if (layerFilter.activeKeys.length === 0) {
      if (previousLayerFilterActiveKeys?.includes("visitors")) {
        setActiveOnlyResidentLayers();
      } else if (previousLayerFilterActiveKeys?.includes("residents")) {
        setActiveOnlyVisitorLayers();
      } else {
        // initial state
        setActiveOnlyVisitorLayers();
      }
    }

    // after clicking show
    if (layerFilter.activeKeys.length === 2) {
      if (previousLayerFilterActiveKeys?.includes("visitors")) {
        setActiveOnlyResidentLayers();
      } else if (previousLayerFilterActiveKeys?.includes("residents")) {
        setActiveOnlyVisitorLayers();
      }
    }
  }, [
    layerFilter,
    previousLayerFilterActiveKeys,
    setActiveOnlyResidentLayers,
    setActiveOnlyVisitorLayers,
  ]);

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

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
  }, [closeDetail, isMobile, isSidebarVisible, previousSidebarVisible]);

  const { height: desktopDetailHeight, ref: desktopDetailRef } =
    useResizeDetector<HTMLDivElement>();

  const markerGroups: ILayerGroup<typeof markerFilter.keys[0]>[] = useMemo(
    () => [
      {
        label: t(`layerGroups.payment.title`),
        layers: [
          {
            value: "parkomats",
            label: t(`layers.parkomats.title`),
            isActive: markerFilter.isAnyKeyActive(["parkomats"]),
            component: ({ isActive, onToggle }) => (
              <button onClick={onToggle} className="flex gap-4 items-center">
                <Icon shadow={false} isWhite={!isActive} icon="parkomat" size={48} />
                <span className="pb-[2px]">{t(`layers.parkomats.title`)}</span>
              </button>
            ),
          },
          {
            value: "assistants",
            label: t(`layers.assistants.title`),
            isActive: markerFilter.isAnyKeyActive(["assistants"]),
            component: ({ isActive, onToggle }) => (
              <button onClick={onToggle} className="flex gap-4 items-center">
                <Icon shadow={false} isWhite={!isActive} icon="assistant" size={48} />
                <span className="pb-[2px]">{t(`layers.assistants.title`)}</span>
              </button>
            ),
          },
          {
            value: "partners",
            label: t(`layers.partners.title`),
            isActive: markerFilter.isAnyKeyActive(["partners"]),
            component: ({ isActive, onToggle }) => (
              <button onClick={onToggle} className="flex gap-4 items-center">
                <Icon shadow={false} isWhite={!isActive} icon="partner" size={48} />
                <span className="pb-[2px]">{t(`layers.partners.title`)}</span>
              </button>
            ),
          },
        ],
      },
      {
        label: t(`layerGroups.parking.title`),
        layers: [
          {
            value: ["garages"],
            label: t(`layers.garages.title`),
            isActive: markerFilter.isAnyKeyActive(["garages"]),
            component: ({ isActive, onToggle }) => (
              <button onClick={onToggle} className="flex gap-4 items-center">
                <Icon shadow={false} isWhite={!isActive} icon="garage" size={48} />
                <span className="pb-[2px]">{t(`layers.garages.title`)}</span>
              </button>
            ),
          },
          {
            value: "p-plus-r",
            label: t(`layers.p-plus-r.title`),
            isActive: markerFilter.isAnyKeyActive(["p-plus-r"]),
            component: ({ isActive, onToggle }) => (
              <button onClick={onToggle} className="flex gap-4 items-center">
                <Icon shadow={false} isWhite={!isActive} icon="p-plus-r" size={48} />
                <span className="pb-[2px]">{t(`layers.p-plus-r.title`)}</span>
              </button>
            ),
          },
          {
            value: "p-plus-r-region",
            label: t(`layers.p-plus-r-region.title`),
            isActive: markerFilter.isAnyKeyActive(["p-plus-r-region"]),
            component: ({ isActive, onToggle }) => (
              <button onClick={onToggle} className="flex gap-4 items-center">
                <Icon shadow={false} isWhite={!isActive} icon="p-plus-r-region" size={48} />
                <span className="pb-[2px]">{t(`layers.p-plus-r-region.title`)}</span>
              </button>
            ),
          },
        ],
      },
      {
        label: t(`layerGroups.support.title`),
        layers: [
          {
            value: "branches",
            label: t(`layers.branches.title`),
            isActive: markerFilter.isAnyKeyActive(["branches"]),
            component: ({ isActive, onToggle }) => (
              <button onClick={onToggle} className="flex gap-4 items-center">
                <Icon shadow={false} isWhite={!isActive} icon="branch" size={48} />
                <span className="pb-[2px]">{t(`layers.branches.title`)}</span>
              </button>
            ),
          },
        ],
      },
    ],
    [markerFilter, t],
  );

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile
      ? ["legend", "compass", "zoom"]
      : ["legend", "geolocation", "compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

  return isLoading ? null : (
    <Map
      ref={mapRef}
      mapboxgl={mapboxgl}
      loadingSpinnerColor="#71CA55"
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={{
        zoom: 12.229005488986582,
        center: {
          lat: 48.16290360284438,
          lng: 17.125377342563297,
        },
      }}
      sources={{
        udr: udrData,
        odp: odpData,
      }}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      moveSearchBarOutsideOfSideBarOnLargeScreen
      onMobileChange={setMobile}
      onGeolocationChange={setGeolocation}
      onMapClick={closeDetail}
    >
      <Filter expression={markerFilter.expression}>
        <Cluster features={markersData?.features ?? []} radius={48}>
          {({ features, lng, lat, key, clusterExpansionZoom }) => (
            <Marker
              isSelected={features[0].id === selectedFeature?.id}
              key={key}
              features={features}
              lat={lat}
              lng={lng}
              onClick={(feature) => {
                if (clusterExpansionZoom) {
                  mapRef.current?.changeViewport({
                    zoom: clusterExpansionZoom,
                    center: {
                      lat,
                      lng,
                    },
                  });
                } else {
                  setSelectedFeature(feature);
                  mapRef.current?.changeViewport({
                    center: {
                      lat,
                      lng,
                    },
                  });
                }
              }}
            />
          )}
        </Cluster>
      </Filter>

      <Layer filters={layerFilter.expression} source="udr" styles={udrStyles} />
      <Layer filters={layerFilter.expression} source="odp" styles={odpStyles} />

      <Slot name="controls">
        <ThemeController
          className={cx("fixed left-4 bottom-[88px] sm:bottom-8 sm:transform", {
            "translate-x-96": isSidebarVisible && !isMobile,
          })}
        />
        <ViewportController
          className={cx("fixed right-4 bottom-[88px] sm:bottom-8", {
            "-translate-x-96": window.innerHeight <= (desktopDetailHeight ?? 0) + 200,
          })}
          slots={viewportControllerSlots}
        />
        <MobileSearch mapRef={mapRef} mapboxgl={mapboxgl} isGeolocation={isGeolocation} />
      </Slot>

      <Layout isOnlyMobile>
        <Slot name="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>

        {/* <Slot
          name="mobile-filter"
          isVisible={isSidebarVisible}
          setVisible={setSidebarVisible}
          avoidControls={false}
        > */}
        {/* <MobileFilters
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            activeFilters={combinedFilter.active}
            onResetFiltersClick={combinedFilter.reset}
            districtFilter={districtFilter}
            tagFilter={tagFilter}
            sportGroundFilter={sportGroundFilter}
            layerFilter={layerFilter}
            layerGroups={layerGroups}
          /> */}
        {/* </Slot> */}

        <Slot name="mobile-detail" isVisible={true}>
          <Detail isMobile feature={selectedFeature} onClose={closeDetail} />
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
            areFiltersDefault={true}
            onResetFiltersClick={() => void 0}
            mapRef={mapRef}
            layerFilter={layerFilter}
            layerGroups={layerGroups}
            markerFilter={markerFilter}
            markerGroups={markerGroups}
            isGeolocation={isGeolocation}
          />
        </Slot>

        {/* <Slot
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
            <Detail isMobile={false} feature={selectedFeature} onClose={closeDetail} />
          </div>
        </Slot> */}
      </Layout>
    </Map>
  );
};

export default App;
