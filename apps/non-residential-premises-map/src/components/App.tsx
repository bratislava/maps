import { useArcgis } from "@bratislava/react-use-arcgis";
import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import "../styles.css";
import colors from "../utils/colors.json";

import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";

// maps
import {
  Layout,
  Map,
  MapHandle,
  SearchBar,
  Slot,
  SlotType,
  ThemeController,
  ViewportController,
} from "@bratislava/react-maps";

import {
  Cluster,
  Filter,
  Layer,
  Marker,
  useCombinedFilter,
  useFilter,
} from "@bratislava/react-mapbox";

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
import { usePrevious } from "@bratislava/utils";
import { FeatureCollection } from "geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { processData } from "../utils/utils";
import { Filters } from "./Filters";
import { point } from "@turf/helpers";

import ESRI_STYLE from "../layer-styles/esri";
import Detail from "./Detail";
import { IconButton } from "@bratislava/react-maps-ui";
import { Funnel } from "@bratislava/react-maps-icons";
import { Feature } from "@bratislava/utils/src/types";

const GEOPORTAL_LAYER_URL =
  "https://geoportal.bratislava.sk/hsite/rest/services/majetok/N%C3%A1jom_nebytov%C3%BDch_priestorov_mesta_Bratislava/MapServer/4";

export const App = () => {
  const { t, i18n } = useTranslation();

  const { data: rawData } = useArcgis(GEOPORTAL_LAYER_URL, {
    format: "geojson",
  });

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniquePurposes, setUniquePurposes] = useState<string[]>([]);
  const [uniqueOccupancies, setUniqueOccupancies] = useState<string[]>([]);

  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  useEffect(() => {
    if (rawData) {
      const { data, uniqueDistricts, uniquePurposes, uniqueOccupancies } = processData(rawData);
      setLoading(false);
      setUniqueDistricts(uniqueDistricts);
      setUniquePurposes(uniquePurposes);
      setUniqueOccupancies(uniqueOccupancies);
      setData(data);
    }
  }, [rawData]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);

  const mapRef = useRef<MapHandle>(null);

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  const purposeFilter = useFilter({
    property: "purpose",
    keys: uniquePurposes,
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

  const areMarkersVisible = useMemo(() => {
    return zoom < 15;
  }, [zoom]);

  const isDetailOpen = useMemo(() => !!selectedFeature, [selectedFeature]);

  return isLoading ? null : (
    <Map
      loadingSpinnerColor={colors.primary}
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
      onMapClick={closeDetail}
      onViewportChangeDebounced={({ zoom }) => setZoom(zoom)}
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
            link: "https://geoportal.bratislava.sk/pfa/apps/sites/#/verejny-mapovy-portal",
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
      <Layer isVisible={!areMarkersVisible} source="ESRI_DATA" styles={ESRI_STYLE} />

      <Filter expression={combinedFilter.expression}>
        {areMarkersVisible && (
          <Cluster features={data?.features ?? []} radius={28}>
            {({ features, lng, lat, key }) => (
              <Marker
                key={key}
                feature={point([lng, lat])}
                onClick={() => {
                  mapRef.current?.changeViewport({ center: { lat, lng }, zoom: 16 });
                }}
              >
                <div className="w-8 cursor-pointer font-semibold h-8 bg-primary flex items-center justify-center rounded-full text-white">
                  {features.length}
                </div>
              </Marker>
            )}
          </Cluster>
        )}
      </Filter>

      <Layer
        ignoreClick
        filters={districtFilter.keepOnEmptyExpression}
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
          <div className="w-4 h-4 bg-background-lightmode dark:bg-background-darkmode border-[2px] rounded-full border-primary" />
        </Marker>
      )}

      <Slot name="controls">
        <ThemeController
          className={cx("fixed left-4 bottom-[88px] sm:bottom-8 sm:transform", {
            "translate-x-96": isSidebarVisible && !isMobile,
          })}
        />
        <ViewportController
          className="fixed right-4 bottom-[88px] sm:bottom-8"
          slots={viewportControllerSlots}
        />
        <div className="fixed bottom-8 left-4 right-4 z-10 shadow-lg rounded-lg sm:hidden">
          <SearchBar placeholder={t("search")} language={i18n.language} direction="top" />
        </div>

        <Slot
          openPadding={{
            left: !isMobile ? 384 : 0, // w-96 or 24rem
          }}
          name="filters"
          isVisible={isSidebarVisible}
          setVisible={setSidebarVisible}
        >
          <Filters
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            activeFilters={combinedFilter.active}
            onResetFiltersClick={combinedFilter.reset}
            purposeFilter={purposeFilter}
            districtFilter={districtFilter}
            occupancyFilter={occupancyFilter}
            isMobile={isMobile ?? false}
          />
        </Slot>
      </Slot>

      <Layout isOnlyMobile>
        <Slot name="mobile-header">
          <div className="fixed top-4 right-4 z-10 sm:hidden">
            <IconButton onClick={() => setSidebarVisible(true)}>
              <Funnel size="md" />
            </IconButton>
          </div>
        </Slot>

        <Slot
          name="mobile-detail"
          isVisible={isDetailOpen}
          openPadding={{
            bottom: window.innerHeight / 2, // w-96 or 24rem
          }}
          avoidControls={false}
        >
          <Detail isMobile features={selectedFeatures ?? []} onClose={closeDetail} />
        </Slot>
      </Layout>

      <Layout isOnlyDesktop>
        <Slot
          name="desktop-detail"
          isVisible={isDetailOpen}
          openPadding={{
            right: 384,
          }}
          avoidControls={false}
        >
          <Detail isMobile={false} features={selectedFeatures ?? []} onClose={closeDetail} />
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
