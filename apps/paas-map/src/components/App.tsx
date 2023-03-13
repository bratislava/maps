import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useResizeDetector } from "react-resize-detector";
import odpStyles from "../layer-styles/residents";
import udrStyles from "../layer-styles/visitors";
import zoneStyles from "../layer-styles/zones";
import "../styles.css";

// maps
import {
  Layout,
  Map,
  MapHandle,
  SearchBar,
  Slot,
  SlotType,
  ThemeController,
  ViewportController
} from "@bratislava/react-maps";

import { Cluster, Filter, IFilterResult, Layer, useFilter } from "@bratislava/react-mapbox";

// components
import { Detail } from "./Detail";

// utils
import { Feature, FeatureCollection, Point } from "geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { processData } from "../utils/utils";
import { MobileHeader } from "./mobile/MobileHeader";

import { useArcgis } from "@bratislava/react-use-arcgis";
import { usePrevious } from "@bratislava/utils";
import { colors } from "../utils/colors";
import { DesktopSearch } from "./desktop/DesktopSearch";
import { Filters } from "./Filters";
import { Marker } from "./Marker";

export const App = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("title");
  }, [t]);

  const { data: rawZonesData } = useArcgis(
    "https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/Hranica_RZ/MapServer/1",
    { format: "geojson" },
  );

  const { data: rawAssistantsData } = useArcgis(
    "https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/doprava/Asistenti_PAAS/MapServer/51",
    { format: "geojson" },
  );

  const { data: rawParkomatsData } = useArcgis(
    "https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/doprava/Parkomaty/MapServer/17",
    { format: "geojson" },
  );

  const { data: rawPartnersData } = useArcgis(
    "https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/Zmluvn%C3%AD_partneri_PAAS/MapServer/128",
    { format: "geojson" },
  );

  const { data: rawParkingLotsData } = useArcgis(
    "https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/Parkovisk%C3%A1/MapServer/118",
    { format: "geojson" },
  );

  const { data: rawBranchesData } = useArcgis(
    "https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/Pobo%C4%8Dka/MapServer/87",
    { format: "geojson" },
  );

  const { data: rawUdrData } = useArcgis(
    "https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/UDR_P/MapServer/40",
    { format: "geojson" },
  );

  const { data: rawOdpData } = useArcgis(
    "https://nest-proxy.bratislava.sk/geoportal/hSite/rest/services/parkovanie/ODP/MapServer/3",
    { format: "geojson" },
  );

  const [isLoading, setLoading] = useState(true);
  const [markersData, setMarkersData] = useState<FeatureCollection | null>(null);
  const [zonesData, setZonesData] = useState<FeatureCollection | null>(null);
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
      rawUdrData &&
      rawOdpData &&
      rawZonesData
    ) {
      const { markersData, udrData, odpData, zonesData } = processData({
        rawZonesData,
        rawAssistantsData,
        rawParkomatsData,
        rawPartnersData,
        rawParkingLotsData,
        rawBranchesData,
        rawUdrData,
        rawOdpData,
      });
      setMarkersData(markersData);
      setZonesData(zonesData);
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
    rawOdpData,
    rawZonesData,
  ]);

  const mapRef = useRef<MapHandle>(null);

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Feature<Point> | null>(null);

  const [isMobile, setMobile] = useState<boolean | null>(null);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const layerFilter = useFilter({
    property: "layer",
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
    keys: useMemo(
      () => [
        "assistants",
        "branches",
        "parkomats",
        "partners",
        "parking-lots",
        "garages",
        "p-plus-r",
      ],
      [],
    ),
    defaultValues: useMemo(
      () => ({
        assistants: false,
        branches: false,
        parkomats: false,
        partners: false,
        "parking-lots": false,
        garages: false,
        "p-plus-r": false,
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
      "parking-lots",
      "garages",
      "p-plus-r",
    ]);
  }, [layerFilter, markerFilter]);

  const setActiveOnlyResidentLayers = useCallback(() => {
    layerFilter.setActiveOnly(["residents"], true);
    markerFilter.setActiveOnly(["branches", "parking-lots", "garages", "p-plus-r"]);
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
    keys: useMemo(() => ["SM1", "NM1", "RU1", "PE1", "RA1"], []),
  });

  const onFeaturesClick = useCallback((features: MapboxGeoJSONFeature[]) => {
    mapRef.current?.moveToFeatures(features);
    setSelectedFeature(features[0] ?? null);
    setSelectedMarker(null);
  }, []);

  const selectedFeatures = useMemo(() => {
    return selectedFeature ? [selectedFeature] : [];
  }, [selectedFeature]);

  // close detail when layers change
  useEffect(() => {
    closeDetail();
  }, [closeDetail, layerFilter.activeKeys, markerFilter.activeKeys, zoneFilter.activeKeys]);

  // zoom to zone/zones after zone filter change
  useEffect(() => {
    const filteredZones = zonesData?.features.filter((zoneFeature) =>
      zoneFilter.activeKeys.find((activeKey) => activeKey === zoneFeature.properties?.zone),
    );
    if (filteredZones?.length) mapRef.current?.fitFeature(filteredZones);
  }, [zoneFilter.activeKeys, zonesData?.features]);

  return isLoading ? null : (
    <Map
      ref={mapRef}
      minZoom={9.5}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      loadingSpinnerColor={colors.green}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      isDevelopment={import.meta.env.DEV}
      onMobileChange={setMobile}
      onMapClick={closeDetail}
      selectedFeatures={selectedFeatures}
      onFeaturesClick={onFeaturesClick}
      mapInformationButtonClassName="!top-20 sm:!top-6"
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
      <Filter expression={markerFilter.keepOnEmptyExpression}>
        <Cluster features={markersData?.features ?? []} radius={44}>
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

      <Layer filters={zoneFilter.keepOnEmptyExpression} geojson={zonesData} styles={zoneStyles} />

      <Layer filters={layerFilter.keepOnEmptyExpression} geojson={udrData} styles={udrStyles} />
      <Layer filters={layerFilter.keepOnEmptyExpression} geojson={odpData} styles={odpStyles} />

      <Slot id="controls">
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
        <div className="fixed bottom-8 left-4 right-4 z-10 shadow-lg rounded-lg sm:hidden">
          <SearchBar placeholder={t("search")} language={i18n.language} direction="top" />
        </div>
      </Slot>

      <Layout isOnlyMobile>
        <Slot id="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
            onVisitorClick={setActiveOnlyVisitorLayers}
            onResidentClick={setActiveOnlyResidentLayers}
            isVisitorOrResidentActive={layerFilter.isAnyKeyActive(["visitors"])}
          />
        </Slot>

        <Slot position="top-right" id="mobile-filters" isVisible={isSidebarVisible}>
          <Filters
            isMobile={true}
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            layerFilter={layerFilter as IFilterResult<string>}
            markerFilter={markerFilter as IFilterResult<string>}
          />
        </Slot>
      </Layout>

      <Layout isOnlyDesktop>
        <Slot id="desktop-search">
          <DesktopSearch areFiltersOpen={isSidebarVisible ?? false} />
        </Slot>

        <Slot
          id="desktop-filters"
          isVisible={isSidebarVisible}
          position="top-left"
          autoPadding
          avoidMapboxControls={!isMobile}
        >
          <Filters
            isMobile={false}
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            layerFilter={layerFilter as IFilterResult<string>}
            markerFilter={markerFilter as IFilterResult<string>}
          />
        </Slot>
      </Layout>

      <Detail
        isOpen={isDetailOpen}
        isMobile={isMobile ?? false}
        feature={selectedFeature ?? selectedMarker}
        onClose={closeDetail}
      />
    </Map>
  );
};

export default App;
