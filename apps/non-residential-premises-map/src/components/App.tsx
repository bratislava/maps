import { useArcgis } from "@bratislava/react-use-arcgis";
import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import "../styles.css";
import { colors } from "../utils/colors";

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

import {
  Cluster,
  Filter,
  Layer,
  useCombinedFilter,
  useFilter,
  useMarkerOrFeaturesInQuery,
} from "@bratislava/react-mapbox";

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
import { usePrevious } from "@bratislava/utils";
import { Feature, FeatureCollection } from "geojson";
import { processData } from "../utils/utils";
import { Filters } from "./Filters";

import { Funnel } from "@bratislava/react-maps-icons";
import { IconButton, Sidebar } from "@bratislava/react-maps-ui";
import { useResizeDetector } from "react-resize-detector";
import { useWindowSize } from "usehooks-ts";
import Detail from "./Detail";
import { Legend } from "./Legend";
import { Marker } from "./Marker";
import { GEOPORTAL_LAYER_URL } from "../utils/const";
import { Point } from "@bratislava/utils/src/types";

const isDevelopment = !!import.meta.env.DEV;

export const App = () => {
  const { t, i18n } = useTranslation();

  const { data: rawData } = useArcgis(GEOPORTAL_LAYER_URL, {
    format: "geojson",
  });

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
      setUniqueDistricts(uniqueDistricts);
      setUniqueStreets(uniqueStreets);
      setUniquePurposes(uniquePurposes);
      setUniqueOccupancies(uniqueOccupancies);
      setData(data);
    }
  }, [rawData]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const mapRef = useRef<MapHandle>(null);

  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [isMobile, setMobile] = useState<boolean | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const [frameState, setFrameState] = useState<boolean>(false);
  const frameStateSideBar = useRef(isSidebarVisible);

  const handleSideBar = useCallback((value: boolean, changePrevious: boolean) => {
    if (changePrevious) frameStateSideBar.current = value;
    setSidebarVisible(value);
  }, []);

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
        filter: districtFilter,
        mapToActive: (activeDistricts) => ({
          title: t("filters.district.title"),
          items: activeDistricts,
        }),
      },
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
          items: activeOccupancies.map((ao) =>
            t(`filters.occupancy.types.${ao as "free" | "forRent" | "occupied"}`),
          ),
        }),
      },
    ],
  });

  useMarkerOrFeaturesInQuery({
    markersData: data,
    selectedFeatures: selectedFeatures,
    zoomAtWhichMarkerWasSelected: zoom,
    setSelectedFeaturesAndZoom: (features, requiredZoom) => {
      // frameState is not set in the beginning - setTimeout as a lazy solution
      setTimeout(() => {
        setSelectedFeatures(features || []);
        const f = features?.[0] as Feature<Point>;
        if (f) {
          mapRef.current?.changeViewport({
            zoom: Math.max(requiredZoom ?? 0, 14),
            center: {
              // TODO continue here
              lng: f?.geometry?.coordinates[0],
              lat: f?.geometry?.coordinates[1],
            },
          });
        }
      }, 300);
    },
  });

  useEffect(() => {
    if (!frameState) return;

    if (selectedFeatures.length > 0) {
      handleSideBar(false, false);
    } else {
      handleSideBar(frameStateSideBar.current, true);
    }
  }, [frameState, selectedFeatures, handleSideBar]);

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

  const fullFilterExpression = useMemo(() => {
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
    if (districtFilter.expression.length) filter.push(districtFilter.expression);
    return filter;
  }, [
    minAreaDebounced,
    maxAreaDebounced,
    minPriceDebounced,
    maxPriceDebounced,
    districtFilter.expression,
    purposeFilter.expression,
    occupancyFilter.expression,
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
      handleSideBar(true, true);
    }
    // from desktop to mobile
    if (previousMobile !== true && isMobile === true) {
      handleSideBar(false, true);
    }

    window === window.parent || isMobile ? setFrameState(false) : setFrameState(true);
  }, [isMobile, previousMobile, handleSideBar]);

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
      setTimeout(() => setLegendVisible(true), 2000);
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
            title: t("legend.forRent"),
            color: colors.forRent,
          },
          {
            title: t("legend.occupied"),
            color: colors.occupied,
          },
          {
            title: t("legend.other"),
            color: colors.other,
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

  useEffect(() => {
    detailRef.current?.scrollIntoView();
  }, [detailRef, selectedFeatures]);

  const { height: windowHeight } = useWindowSize();

  const shouldBeViewportControlsMoved = useMemo(() => {
    return windowHeight < viewportControlsHeight + detailHeight + 40;
  }, [windowHeight, detailHeight, viewportControlsHeight]);

  return (
    <Map
      loadingSpinnerColor={colors.primary}
      ref={mapRef}
      minZoom={!isMobile ? 10.8 : 10.4}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      enableSatelliteOnLoad
      initialViewport={{
        zoom: 12.229005488986582,
        center: {
          lat: 48.148598,
          lng: 17.107748,
        },
      }}
      isDevelopment={isDevelopment}
      onMobileChange={setMobile}
      onMapClick={closeDetail}
      onViewportChangeDebounced={(viewport) => {
        setZoom(viewport.zoom);
      }}
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
      <Filter expression={fullFilterExpression}>
        <Cluster features={data?.features ?? []} radius={28}>
          {({ features, lng, lat, isCluster, key, clusterExpansionZoom }) => {
            return (
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
            );
          }}
        </Cluster>
      </Filter>

      {/* <Filter expression={areaFilterExpression}>
        {(data?.features as Feature<Point>[])?.map((feature, key) => (
          <Marker
            features={[feature]}
            lng={feature.geometry.coordinates[0]}
            lat={feature.geometry.coordinates[1]}
            key={key}
            isSelected={!!selectedFeatures.find((sf) => sf.id === feature.id)}
            onClick={() => {
              // setSelectedFeatures(features);
              // mapRef.current?.changeViewport({ center: { lat, lng } });
            }}
          />
        ))}
      </Filter> */}

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
          <IconButton className="m-4" onClick={() => handleSideBar(!isSidebarVisible, true)}>
            <Funnel size="md" />
          </IconButton>
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
          setVisible={(isVisible) => handleSideBar(isVisible ?? false, true)}
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

      <Detail
        ref={detailRef}
        avoidMapboxControls={shouldBeViewportControlsMoved}
        isMobile={isMobile ?? false}
        features={selectedFeatures ?? []}
        onClose={closeDetail}
      />
    </Map>
  );
};

export default App;
