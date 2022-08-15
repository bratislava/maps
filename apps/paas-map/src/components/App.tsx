import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useResizeDetector } from "react-resize-detector";
import odpStyles from "../layer-styles/residents/residents";
import udrStyles from "../layer-styles/visitors/visitors";
import "../styles.css";

// maps
import {
  Layout,
  Map,
  MapHandle,
  Slot,
  SlotType,
  ThemeController,
  ViewportController,
} from "@bratislava/react-maps";

import { Cluster, Filter, Layer, useFilter } from "@bratislava/react-mapbox";

// components
import { Detail } from "./Detail";

// utils
import { Feature, FeatureCollection, Point } from "geojson";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";
import { processData } from "../utils/utils";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileSearch } from "./mobile/MobileSearch";

import { useArcgis } from "@bratislava/react-use-arcgis";
import { usePrevious } from "@bratislava/utils";
import { DesktopSearch } from "./desktop/DesktopSearch";
import { Filters } from "./Filters";
import { Marker } from "./Marker";

export const App = () => {
  const { t } = useTranslation();

  const { data: rawAssistantsData } = useArcgis(
    "https://geoportal.bratislava.sk/hsite/rest/services/doprava/Asistenti_PAAS/MapServer/51",
    { format: "geojson" },
  );

  const { data: rawParkomatsData } = useArcgis(
    "https://geoportal.bratislava.sk/hsite/rest/services/doprava/Parkomaty/MapServer/17",
    { format: "geojson" },
  );

  const { data: rawPartnersData } = useArcgis(
    "https://geoportal.bratislava.sk/hsite/rest/services/parkovanie/Affiliate_Partners/MapServer/128",
    { format: "geojson" },
  );

  const { data: rawParkingLotsData } = useArcgis(
    "https://geoportal.bratislava.sk/hsite/rest/services/parkovanie/Parkovisk%C3%A1/MapServer/118",
    { format: "geojson" },
  );

  const { data: rawBranchesData } = useArcgis(
    "https://geoportal.bratislava.sk/hsite/rest/services/parkovanie/Pobo%C4%8Dka/MapServer/87",
    { format: "geojson" },
  );

  const { data: rawUdrData } = useArcgis(
    "https://geoportal.bratislava.sk/hsite/rest/services/parkovanie/UDR_P/MapServer/40",
    { format: "geojson" },
  );

  const [isLoading, setLoading] = useState(true);
  const [markersData, setMarkersData] = useState<FeatureCollection | null>(null);
  const [udrData, setUdrData] = useState<FeatureCollection | null>(null);
  const [odpData, setOdpData] = useState<FeatureCollection | null>(null);
  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (
      rawAssistantsData &&
      rawParkomatsData &&
      rawPartnersData &&
      rawParkingLotsData &&
      rawBranchesData &&
      rawUdrData
    ) {
      const { markersData, udrData, odpData } = processData({
        rawAssistantsData,
        rawParkomatsData,
        rawPartnersData,
        rawParkingLotsData,
        rawBranchesData,
        rawUdrData,
      });
      setMarkersData(markersData);
      setUdrData(udrData);
      setOdpData(odpData);
      setLoading(false);
    }
  }, [
    rawAssistantsData,
    rawParkomatsData,
    rawPartnersData,
    rawParkingLotsData,
    rawBranchesData,
    rawUdrData,
  ]);

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Feature<Point> | null>(null);

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

  const previousLayerFilterActiveKeys = usePrevious(layerFilter.activeKeys);

  const markerFilter = useFilter({
    property: "kind",
    keepOnEmpty: true,
    keys: useMemo(() => ["assistants", "branches", "parkomats", "partners", "parking-lots"], []),
    defaultValues: useMemo(
      () => ({
        assistants: false,
        branches: false,
        parkomats: false,
        partners: false,
        "parking-lots": false,
      }),
      [],
    ),
  });

  const setActiveOnlyVisitorLayers = useCallback(() => {
    layerFilter.setActiveOnly(["visitors"], true);
    markerFilter.setActiveOnly(["assistants", "partners", "parkomats", "parking-lots"]);
  }, [layerFilter, markerFilter]);

  const setActiveOnlyResidentLayers = useCallback(() => {
    layerFilter.setActiveOnly(["residents"], true);
    markerFilter.setActiveOnly(["branches", "parking-lots"]);
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
        setActiveOnlyResidentLayers();
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

  const isDetailOpen = useMemo(
    () => !!(selectedFeature ?? selectedMarker),
    [selectedFeature, selectedMarker],
  );

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
    setSelectedMarker(null);
  }, []);

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
  }, [closeDetail, isMobile, isSidebarVisible, previousSidebarVisible]);

  const { height: desktopDetailHeight, ref: desktopDetailRef } =
    useResizeDetector<HTMLDivElement>();

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile ? ["compass", "zoom"] : ["geolocation", "compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

  const zoneFilter = useFilter({
    property: "zone",
    keys: useMemo(() => ["SM1", "RU1"], []),
  });

  const initialViewport = useMemo(
    () => ({
      zoom: 12.229005488986582,
      center: {
        lat: 48.16290360284438,
        lng: 17.125377342563297,
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

  const sources = useMemo(
    () => ({
      udr: udrData,
      odp: odpData,
    }),
    [udrData, odpData],
  );

  const onFeaturesClick = useCallback((features: MapboxGeoJSONFeature[]) => {
    mapRef.current?.moveToFeatures(features);
    setSelectedFeature(features[0] ?? null);
    setSelectedMarker(null);
  }, []);

  const selectedFeatures = useMemo(() => {
    return selectedFeature ? [selectedFeature] : [];
  }, [selectedFeature]);

  return isLoading ? null : (
    <Map
      ref={mapRef}
      mapboxgl={mapboxgl}
      loadingSpinnerColor="#71CA55"
      mapStyles={mapStyles}
      initialViewport={initialViewport}
      sources={sources}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      onMobileChange={setMobile}
      onGeolocationChange={setGeolocation}
      onMapClick={closeDetail}
      selectedFeatures={selectedFeatures}
      onFeaturesClick={onFeaturesClick}
    >
      <Filter expression={markerFilter.expression}>
        <Cluster features={markersData?.features ?? []} radius={48}>
          {({ features, lng, lat, key, clusterExpansionZoom }) => (
            <Marker
              isSelected={features[0].id === selectedMarker?.id}
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
                  setSelectedMarker(feature);
                  setSelectedFeature(null);
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
            onVisitorClick={setActiveOnlyVisitorLayers}
            onResidentClick={setActiveOnlyResidentLayers}
            isVisitorOrResidentActive={layerFilter.isAnyKeyActive(["visitors"])}
          />
        </Slot>

        <Slot name="mobile-filters" isVisible={isSidebarVisible} setVisible={setSidebarVisible}>
          <Filters
            isMobile={true}
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            layerFilter={layerFilter}
            markerFilter={markerFilter}
            zoneFilter={zoneFilter}
          />
        </Slot>

        <Slot
          name="mobile-detail"
          // openPadding={{ bottom: 200 }}
          avoidControls={false}
          isVisible={isDetailOpen}
        >
          <Detail
            isOpen={isDetailOpen}
            isMobile
            feature={selectedFeature ?? selectedMarker}
            onClose={closeDetail}
          />
        </Slot>
      </Layout>

      <Layout isOnlyDesktop>
        <Slot name="desktop-search">
          <DesktopSearch
            areFiltersOpen={isSidebarVisible ?? false}
            mapRef={mapRef}
            mapboxgl={mapboxgl}
            isGeolocation={isGeolocation}
          />
        </Slot>

        <Slot
          name="desktop-filters"
          isVisible={isSidebarVisible}
          setVisible={setSidebarVisible}
          openPadding={{
            left: 384, // w-96 or 24rem
          }}
        >
          <Filters
            isMobile={false}
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            layerFilter={layerFilter}
            markerFilter={markerFilter}
            zoneFilter={zoneFilter}
          />
        </Slot>

        <Slot name="desktop-detail" isVisible={isDetailOpen} avoidControls={false}>
          <div
            ref={desktopDetailRef}
            className={cx(
              "fixed top-0 right-0 w-96 bg-background-lightmode transition-all duration-500",
              {
                "translate-x-full": !isDetailOpen,
                "shadow-lg": isDetailOpen,
              },
            )}
          >
            <Detail
              isOpen={isDetailOpen}
              isMobile={false}
              feature={selectedFeature ?? selectedMarker}
              onClose={closeDetail}
            />
          </div>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
