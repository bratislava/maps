import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import "../styles.css";

// maps
import {
  DISTRICTS_GEOJSON,
  Layout,
  Map,
  MapHandle,
  Slot,
  SlotType,
  ThemeController,
  ViewportController,
} from "@bratislava/react-maps";

import { Layer, Marker, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
import { usePrevious } from "@bratislava/utils";
import { FeatureCollection } from "geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { processData } from "../utils/utils";
import { DesktopFilters } from "./desktop/DesktopFilters";
import { MobileFilters } from "./mobile/MobileFilters";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileSearch } from "./mobile/MobileSearch";

export const App = () => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueOccupancies, setUniqueOccupancies] = useState<string[]>([]);

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  useEffect(() => {
    const { data, uniqueDistricts, uniqueOccupancies } = processData();
    setLoading(false);
    setUniqueDistricts(uniqueDistricts);
    setUniqueOccupancies(uniqueOccupancies);
    setData(data);
  }, []);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);

  const mapRef = useRef<MapHandle>(null);

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);
  const [isGeolocation, setGeolocation] = useState(false);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const purposeFilter = useFilter({
    property: "purpose",
    keys: useMemo(() => [] as string[], []),
  });

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  const occupancyFilter = useFilter({
    property: "occupancySimple",
    keys: uniqueOccupancies,
  });

  const combinedFilter = useCombinedFilter({
    combiner: "all",
    filters: [
      {
        filter: purposeFilter,
        mapToActive: (activePurposes) => ({
          title: t("filters.purpose.title"),
          items: activePurposes,
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
        filter: occupancyFilter,
        mapToActive: (activeOccupancies) => ({
          title: t("filters.uccupancy.title"),
          items: activeOccupancies,
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

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile ? ["compass", "zoom"] : ["geolocation", "compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

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

  const mapStyles = useMemo(
    () => ({
      light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
      dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
    }),
    [],
  );

  const sources = useMemo(
    () => ({
      ESRI_DATA: data,
      DISTRICTS_GEOJSON,
    }),
    [data],
  );

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#E46054"
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={mapStyles}
      initialViewport={initialViewport}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      sources={sources}
      onFeaturesClick={(features) => setSelectedFeature(features[0])}
      selectedFeatures={selectedFeatures}
      onMobileChange={setMobile}
      onGeolocationChange={setGeolocation}
      onMapClick={closeDetail}
      scrollZoomBlockerCtrlMessage={t("tooltips.scrollZoomBlockerCtrlMessage")}
      scrollZoomBlockerCmdMessage={t("tooltips.scrollZoomBlockerCmdMessage")}
      touchPanBlockerMessage={t("tooltips.touchPanBlockerMessage")}
      errors={{
        generic: t("errors.generic"),
        notLocatedInBratislava: t("errors.notLocatedInBratislava"),
        noGeolocationSupport: t("errors.noGeolocationSupport"),
      }}
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
      {/* <Layer filters={combinedFilter.expression} isVisible source="ESRI_DATA" styles={ESRI_STYLE} /> */}
      <Layer
        ignoreClick
        filters={districtFilter.expression}
        source="DISTRICTS_GEOJSON"
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

      <Slot name="controls">
        <ThemeController
          darkLightModeTooltip={t("tooltips.darkLightMode")}
          satelliteModeTooltip={t("tooltips.satelliteMode")}
          className={cx("fixed left-4 bottom-[88px] sm:bottom-8 sm:transform", {
            "translate-x-96": isSidebarVisible && !isMobile,
          })}
        />
        <ViewportController
          className="fixed right-4 bottom-[88px] sm:bottom-8"
          slots={viewportControllerSlots}
        />
        <MobileSearch mapRef={mapRef} isGeolocation={isGeolocation} />
      </Slot>

      <Layout isOnlyMobile>
        <Slot name="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>

        <Slot name="mobile-filter" isVisible={isSidebarVisible} setVisible={setSidebarVisible}>
          <MobileFilters
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            activeFilters={combinedFilter.active}
            onResetFiltersClick={combinedFilter.reset}
            purposeFilter={purposeFilter}
            districtFilter={districtFilter}
            occupancyFilter={occupancyFilter}
          />
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
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            onResetFiltersClick={combinedFilter.reset}
            mapRef={mapRef}
            purposeFilter={purposeFilter}
            districtFilter={districtFilter}
            isGeolocation={isGeolocation}
            occupancyFilter={occupancyFilter}
            filters={combinedFilter.expression}
          />
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
