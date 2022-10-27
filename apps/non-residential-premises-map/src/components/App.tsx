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

import { Cluster, Filter, Layer, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
import { usePrevious } from "@bratislava/utils";
import { Feature, FeatureCollection } from "geojson";
import { processData } from "../utils/utils";
import { Filters } from "./Filters";

import Detail from "./Detail";
import { IconButton } from "@bratislava/react-maps-ui";
import { Funnel } from "@bratislava/react-maps-icons";
import { Marker } from "./Marker";

const isDevelopment = !!import.meta.env.DEV;

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
  const [, setUniqueStreets] = useState<string[]>([]);
  const [uniquePurposes, setUniquePurposes] = useState<string[]>([]);
  const [uniqueOccupancies, setUniqueOccupancies] = useState<string[]>([]);

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  useEffect(() => {
    if (rawData) {
      const { data, uniqueDistricts, uniquePurposes, uniqueOccupancies, uniqueStreets } =
        processData(rawData);
      setLoading(false);
      setUniqueDistricts(uniqueDistricts);
      setUniqueStreets(uniqueStreets);
      setUniquePurposes(uniquePurposes);
      setUniqueOccupancies(uniqueOccupancies);
      setData(data);
    }
  }, [rawData]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);

  const mapRef = useRef<MapHandle>(null);

  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
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
    property: "occupancy",
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
          title: t("filters.occupancy.title"),
          items: activeOccupancies,
        }),
      },
    ],
  });

  const minAreaDefault = 0;
  const [minArea, setMinArea] = useState(minAreaDefault);
  const [minAreaDebounced, setMinAreaDebounced] = useState(minAreaDefault);

  const maxAreaDefault = 15_000;
  const [maxArea, setMaxArea] = useState(maxAreaDefault);
  const [maxAreaDebounced, setMaxAreaDebounced] = useState(maxAreaDefault);

  const minPriceDefault = 0;
  const [minPrice, setMinPrice] = useState(minPriceDefault);
  const [minPriceDebounced, setMinPriceDebounced] = useState(minPriceDefault);

  const maxPriceDefault = 100_000;
  const [maxPrice, setMaxPrice] = useState(maxPriceDefault);
  const [maxPriceDebounced, setMaxPriceDebounced] = useState(maxPriceDefault);

  const areaFilterExpression = useMemo(() => {
    const filter: any = [
      "all",
      [">=", "approximateArea", minAreaDebounced],
      ["<=", "approximateArea", maxAreaDebounced],
      [">=", "approximateRentPricePerYear", minPriceDebounced],
      ["<=", "approximateRentPricePerYear", maxPriceDebounced],
    ];

    if (purposeFilter.expression.length) filter.push(purposeFilter.expression);
    if (occupancyFilter.expression.length) filter.push(occupancyFilter.expression);

    console.log(filter);
    return filter;
  }, [
    minAreaDebounced,
    maxAreaDebounced,
    minPriceDebounced,
    maxPriceDebounced,
    purposeFilter,
    occupancyFilter,
  ]);

  const closeDetail = useCallback(() => {
    setSelectedFeatures([]);
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
    if (MAP && selectedFeatures.length) {
      const firstFeature = selectedFeatures[0];
      setTimeout(() => {
        if (firstFeature.geometry.type === "Point") {
          mapRef.current?.changeViewport({
            center: {
              lng: firstFeature.geometry.coordinates[0],
              lat: firstFeature.geometry.coordinates[1],
            },
          });
        }
      }, 0);
    }
  }, [selectedFeatures]);

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile ? ["compass", "zoom"] : ["geolocation", "compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

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

  const areFiltersDefault = useMemo(() => {
    return (
      occupancyFilter.areDefault &&
      districtFilter.areDefault &&
      purposeFilter.areDefault &&
      minPriceDebounced === minPriceDefault &&
      maxPriceDebounced === maxPriceDefault &&
      minAreaDebounced === minAreaDefault &&
      maxAreaDebounced === maxAreaDefault
    );
  }, [
    maxAreaDebounced,
    maxPriceDebounced,
    minAreaDebounced,
    minPriceDebounced,
    districtFilter.areDefault,
    occupancyFilter.areDefault,
    purposeFilter.areDefault,
  ]);

  useEffect(() => {
    closeDetail();
  }, [
    closeDetail,
    maxAreaDebounced,
    maxPriceDebounced,
    minAreaDebounced,
    minPriceDebounced,
    districtFilter.keys,
    occupancyFilter.keys,
    purposeFilter.keys,
  ]);

  const handleResetFilters = useCallback(() => {
    setMinArea(minAreaDefault);
    setMaxArea(maxAreaDefault);
    setMinPrice(minPriceDefault);
    setMaxPrice(maxPriceDefault);
    setMinAreaDebounced(minAreaDefault);
    setMaxAreaDebounced(maxAreaDefault);
    setMinPriceDebounced(minPriceDefault);
    setMaxPriceDebounced(maxPriceDefault);
    occupancyFilter.reset();
    districtFilter.reset();
    purposeFilter.reset();
  }, [occupancyFilter, districtFilter, purposeFilter]);

  const isDetailOpen = useMemo(() => !!selectedFeatures.length, [selectedFeatures]);

  return isLoading ? null : (
    <Map
      loadingSpinnerColor={colors.primary}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={mapStyles}
      initialViewport={initialViewport}
      isDevelopment={isDevelopment}
      isOutsideLoading={isLoading}
      sources={sources}
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
      <Filter expression={areaFilterExpression}>
        <Cluster features={data?.features ?? []} radius={28}>
          {({ features, lng, lat, isCluster, key, clusterExpansionZoom }) => (
            <Marker
              features={features}
              lng={lng}
              lat={lat}
              key={key}
              onClick={() => {
                // When it's cluster and it's expandable
                if (isCluster && clusterExpansionZoom && clusterExpansionZoom !== 31) {
                  setSelectedFeatures([]);
                  mapRef.current?.changeViewport({
                    center: { lat, lng },
                    zoom: clusterExpansionZoom,
                  });
                } else {
                  setSelectedFeatures(features);
                  mapRef.current?.changeViewport({ center: { lat, lng } });
                }
              }}
            />
          )}
        </Cluster>
      </Filter>

      <Layer
        ignoreClick
        filters={districtFilter.keepOnEmptyExpression}
        source="DISTRICTS_GEOJSON"
        styles={DISTRICTS_STYLE}
      />

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
            areFiltersDefault={areFiltersDefault}
            activeFilters={combinedFilter.active}
            onResetFiltersClick={handleResetFilters}
            purposeFilter={purposeFilter}
            districtFilter={districtFilter}
            occupancyFilter={occupancyFilter}
            isMobile={isMobile ?? false}
            minArea={minArea}
            maxArea={maxArea}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onAreaChange={(a) => {
              setMinArea(a[0]);
              setMaxArea(a[1]);
            }}
            onAreaChangeEnd={(a) => {
              setMinAreaDebounced(a[0]);
              setMaxAreaDebounced(a[1]);
            }}
            onPriceChange={(p) => {
              setMinPrice(p[0]);
              setMaxPrice(p[1]);
            }}
            onPriceChangeEnd={(p) => {
              setMinPriceDebounced(p[0]);
              setMaxPriceDebounced(p[1]);
            }}
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
          autoPadding
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
