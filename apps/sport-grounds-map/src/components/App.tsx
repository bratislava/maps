import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "../styles.css";
import { useResizeDetector } from "react-resize-detector";

// maps
import {
  DISTRICTS_GEOJSON,
  usePrevious,
  Slot,
  Layout,
  MapHandle,
  Map,
  Layer,
  useFilter,
} from "@bratislava/react-maps-core";
import { IActiveFilter } from "@bratislava/react-maps-ui";
import { Close } from "@bratislava/react-maps-icons";

// components
import { Detail } from "./Detail";

// utils
import i18next from "../utils/i18n";
import { processData } from "../utils/utils";
import mapboxgl from "mapbox-gl";
import { Feature, FeatureCollection } from "geojson";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileFilters } from "./mobile/MobileFilters";
import { DesktopFilters } from "./desktop/DesktopFilters";
import { MobileSearch } from "./mobile/MobileSearch";

import RAW_DATA_SPORT_GROUNDS_FEATURES from "../assets/layers/sport-grounds/sport-grounds-data";
import RAW_DATA_SPORT_GROUNDS_ALT_FEATURES from "../assets/layers/sport-grounds/sport-grounds-alt-data";
import SPORT_GROUNDS_STYLE from "../assets/layers/sport-grounds/sport-grounds-style";
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

export const App = () => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);

  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const { data, uniqueDistricts, uniqueTypes } = processData(
      RAW_DATA_SPORT_GROUNDS_FEATURES,
      RAW_DATA_SPORT_GROUNDS_ALT_FEATURES,
    );

    setData(data);
    setUniqueDistricts(uniqueDistricts);
    setUniqueTypes(uniqueTypes);
    setLoading(false);
  }, []);

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const [selectedFeatures, setSelectedFeatures] = useState<Feature[] | null>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);
  const [isGeolocation, setGeolocation] = useState(false);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  const typeFilter = useFilter({
    property: "kind",
    keys: uniqueTypes,
    defaultValues: useMemo(
      () => uniqueTypes.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}),
      [uniqueTypes],
    ),
  });

  const areFiltersDefault = useMemo(() => {
    return districtFilter.areDefault && typeFilter.areDefault;
  }, [districtFilter.areDefault, typeFilter.areDefault]);

  const resetFilters = useCallback(() => {
    typeFilter.reset();
    districtFilter.reset();
  }, [typeFilter, districtFilter]);

  const activeFilters: IActiveFilter[] = useMemo(() => {
    return [
      {
        title: t("filters.district.title"),
        items: districtFilter.activeKeys,
      },
      {
        title: t("filters.type.title"),
        items: typeFilter.activeKeys.map((type) => t(`filters.type.types.${type}`)),
      },
    ];
  }, [districtFilter.activeKeys, t, typeFilter.activeKeys]);

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
    () => (selectedFeatures ? !!selectedFeatures.length : undefined),
    [selectedFeatures],
  );

  const closeDetail = useCallback(() => {
    mapRef.current?.deselectAllFeatures();
  }, [mapRef]);

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
  }, [closeDetail, isMobile, isSidebarVisible, previousSidebarVisible]);

  // fit to district
  useEffect(() => {
    districtFilter.activeKeys.length == 0
      ? mapRef.current?.changeViewport({
          center: {
            lat: 48.148598,
            lng: 17.107748,
          },
          zoom: 10.75,
        })
      : mapRef.current?.fitToDistrict(districtFilter.activeKeys);
  }, [districtFilter.activeKeys, mapRef]);

  // move point to center when selected
  useEffect(() => {
    const MAP = mapRef.current;
    if (MAP && selectedFeatures && selectedFeatures.length) {
      const feature = selectedFeatures[0];
      setTimeout(() => {
        if (feature.geometry.type === "Point") {
          mapRef.current?.changeViewport({
            center: {
              lng: feature.geometry.coordinates[0],
              lat: feature.geometry.coordinates[1],
            },
          });
        }
      }, 0);
    }
  }, [selectedFeatures, mapRef]);

  const { height: desktopDetailHeight, ref: desktopDetailRef } =
    useResizeDetector<HTMLDivElement>();

  return isLoading ? null : (
    <Map
      ref={mapRef}
      mapboxgl={mapboxgl}
      i18next={i18next}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
        satellite: import.meta.env.PUBLIC_MAPBOX_SATELLITE_STYLE,
      }}
      initialViewport={{
        center: {
          lat: 48.148598,
          lng: 17.107748,
        },
      }}
      icons={{
        "hockey-icon": {
          path: "icons/hockey.svg",
          width: 160,
          height: 160,
        },
        "fitness-icon": {
          path: "icons/fitness.svg",
          width: 160,
          height: 160,
        },
        "tennis-icon": {
          path: "icons/tennis.svg",
          width: 160,
          height: 160,
        },
        "pool-icon": {
          path: "icons/pool.svg",
          width: 160,
          height: 160,
        },
        "basketball-icon": {
          path: "icons/basketball.svg",
          width: 160,
          height: 160,
        },
        "cvicko-icon": {
          path: "icons/cvicko.svg",
          width: 160,
          height: 160,
        },
        "gym-icon": {
          path: "icons/gym.svg",
          width: 160,
          height: 160,
        },
        "table-tennis-icon": {
          path: "icons/table-tennis.svg",
          width: 160,
          height: 160,
        },
        "water-icon": {
          path: "icons/water.svg",
          width: 160,
          height: 160,
        },
        "running-track-icon": {
          path: "icons/running-track.svg",
          width: 160,
          height: 160,
        },
        "football-icon": {
          path: "icons/football.svg",
          width: 160,
          height: 160,
        },
        "other-icon": {
          path: "icons/other.svg",
          width: 160,
          height: 160,
        },
      }}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      moveSearchBarOutsideOfSideBarOnLargeScreen
      sources={{
        SPORT_GROUNDS_DATA: data,
        DISTRICTS_GEOJSON,
      }}
      onSelectedFeaturesChange={setSelectedFeatures}
      onMobileChange={setMobile}
      onGeolocationChange={setGeolocation}
    >
      <Layer
        filters={["all", typeFilter.filter, districtFilter.filter]}
        isVisible
        source="SPORT_GROUNDS_DATA"
        styles={SPORT_GROUNDS_STYLE}
      />
      <Layer
        ignoreClick
        filters={["all", districtFilter.filter]}
        source="DISTRICTS_GEOJSON"
        styles={DISTRICTS_STYLE}
      />

      {/* {data?.features.slice(0, 5).map((feature, index) => (
        <Marker key={index} feature={feature} />
      ))} */}

      <Layout isOnlyMobile>
        <Slot name="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>

        <Slot
          name="mobile-filter"
          isVisible={isSidebarVisible}
          setVisible={setSidebarVisible}
          avoidControls={false}
        >
          <MobileFilters
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={areFiltersDefault}
            activeFilters={activeFilters}
            onResetFiltersClick={resetFilters}
            districtFilter={districtFilter}
            typeFilter={typeFilter}
          />
        </Slot>

        <Slot
          name="mobile-detail"
          isVisible={isDetailOpen}
          bottomSheetOptions={{
            footer: (
              <div className="bg-gray bg-opacity-10 z-20">
                <button
                  onClick={closeDetail}
                  className="p-3 flex items-center hover:underline justify-center mx-auto"
                >
                  <span className="font-bold">{t("close")}</span>
                  <Close className="text-primary" width={32} height={32} />
                </button>
              </div>
            ),
          }}
          openPadding={{
            bottom: window.innerHeight / 2, // w-96 or 24rem
          }}
          avoidControls={false}
        >
          <div className="relative h-full">
            <Detail features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
        </Slot>

        <Slot name="mobile-search">
          <MobileSearch mapRef={mapRef} mapboxgl={mapboxgl} isGeolocation={isGeolocation} />
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
            areFiltersDefault={areFiltersDefault}
            activeFilters={activeFilters}
            onResetFiltersClick={resetFilters}
            mapRef={mapRef}
            districtFilter={districtFilter}
            typeFilter={typeFilter}
            isGeolocation={isGeolocation}
          />
        </Slot>

        <Slot
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
            <Detail features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
