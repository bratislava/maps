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
import { IconButton, Sidebar } from "@bratislava/react-maps-ui";
import { Funnel } from "@bratislava/react-maps-icons";
import { Marker } from "./Marker";
import { Legend } from "./Legend";
import { useResizeDetector } from "react-resize-detector";
import { useWindowSize } from "usehooks-ts";

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

  const [isLegendVisible, setLegendVisible] = useState(false);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = [
      "all",
      [">=", "approximateArea", minAreaDebounced],
      ["<=", "approximateArea", maxAreaDebounced],
      [">=", "approximateRentPricePerYear", minPriceDebounced],
      ["<=", "approximateRentPricePerYear", maxPriceDebounced],
    ];

    if (purposeFilter.expression.length) filter.push(purposeFilter.expression);
    if (occupancyFilter.expression.length) filter.push(occupancyFilter.expression);
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

  // Open legend on desktop by default
  useEffect(() => {
    if (!isMobile && previousMobile) {
      setLegendVisible(true);
    }
    if (data?.features && isMobile) {
      mapRef.current?.fitFeature(data.features, { padding: 16 });
    }
  }, [data?.features, isMobile, previousMobile]);

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

  const legend = useMemo(() => {
    return (
      <Legend
        items={[
          {
            title: t("legend.free"),
            color: colors.free,
          },
          {
            title: t("legend.occupied"),
            color: colors.occupied,
          },
          {
            title: t("legend.districtBorder"),
            color: colors.disctrictBorder,
            type: "line",
          },
        ]}
      />
    );
  }, [t]);

  const { height: viewportControlsHeight = 0, ref: viewportControlsRef } = useResizeDetector();
  const { height: detailHeight = 0, ref: detailRef } = useResizeDetector();

  const { height: windowHeight } = useWindowSize();

  const shouldBeViewportControlsMoved = useMemo(() => {
    return windowHeight < viewportControlsHeight + detailHeight + 40;
  }, [windowHeight, detailHeight, viewportControlsHeight]);

  return isLoading ? null : (
    <Map
      loadingSpinnerColor={colors.primary}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={mapStyles}
      initialViewport={initialViewport}
      isDevelopment={isDevelopment}
      isOutsideLoading={isLoading}
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
              isSelected={!!selectedFeatures.find((sf) => sf.id === features[0].id)}
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
        geojson={DISTRICTS_GEOJSON}
        styles={DISTRICTS_STYLE}
      />

      <Slot
        id="controls"
        position="bottom"
        className="p-4 pb-9 flex flex-col gap-2 w-screen pointer-events-none"
      >
        <div className="flex justify-between items-end">
          <ThemeController
            className={cx("pointer-events-auto", {
              "translate-x-96 delay-75": isSidebarVisible && !isMobile,
              "translate-x-0 delay-200": !(isSidebarVisible && !isMobile),
            })}
          />
          <div ref={viewportControlsRef}>
            <ViewportController
              className={cx({
                "-translate-x-96": shouldBeViewportControlsMoved,
                "translate-x-0": !shouldBeViewportControlsMoved,
              })}
              slots={["legend", ["compass", "zoom"]]}
              desktopSlots={["legend", "geolocation", "compass", ["fullscreen", "zoom"]]}
              legend={legend}
              isLegendOpen={isLegendVisible}
              onLegendOpenChange={setLegendVisible}
            />
          </div>
        </div>
        <div className="pointer-events-auto shadow-lg rounded-lg sm:hidden">
          <SearchBar placeholder={t("search")} language={i18n.language} direction="top" />
        </div>
      </Slot>

      <Layout isOnlyMobile>
        <Slot id="mobile-header" position="top-right">
          <IconButton className="m-4" onClick={() => setSidebarVisible(true)}>
            <Funnel size="md" />
          </IconButton>
        </Slot>

        <Slot
          id="mobile-detail"
          isVisible={isDetailOpen}
          position="bottom"
          padding={{ bottom: window.innerHeight / 2 }}
        >
          <Detail isMobile features={selectedFeatures ?? []} onClose={closeDetail} />
        </Slot>

        <Slot id="mobile-legend" isVisible={isLegendVisible} position="top-right">
          <Sidebar
            title={t("title")}
            isMobile
            isVisible={isLegendVisible}
            position="right"
            closeText={t("close")}
            onClose={() => setLegendVisible(false)}
            onOpen={() => setLegendVisible(true)}
          >
            <div className="p-6">{legend}</div>
          </Sidebar>
        </Slot>
      </Layout>

      <Slot
        id="filters"
        isVisible={isSidebarVisible}
        position="top-left"
        autoPadding={!isMobile}
        avoidMapboxControls={!isMobile}
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

      <Layout isOnlyDesktop>
        <Slot
          id="desktop-detail"
          isVisible={isDetailOpen}
          position="top-right"
          autoPadding
          avoidMapboxControls={shouldBeViewportControlsMoved}
        >
          <div ref={detailRef}>
            <Detail isMobile={false} features={selectedFeatures ?? []} onClose={closeDetail} />
          </div>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
