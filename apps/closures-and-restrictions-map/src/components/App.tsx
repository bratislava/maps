import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import "../styles.css";
import { useResizeDetector } from "react-resize-detector";
import { useWindowSize } from "usehooks-ts";
import { DateValue } from "@react-types/calendar";

// maps
import {
  Cluster,
  Filter,
  IFilterResult,
  Layer,
  useCombinedFilter,
  useFilter,
} from "@bratislava/react-mapbox";
import {
  Layout,
  Map,
  MapHandle,
  SearchBar,
  Slot,
  ThemeController,
  ViewportController,
} from "@bratislava/react-maps";
import { useArcgis } from "@bratislava/react-use-arcgis";
import { MapboxGeoJSONFeature } from "mapbox-gl";

// components

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts/districts";
import REPAIRS_POLYGONS_STYLE from "../assets/layers/repairs/repairsPolygons";

// utils
import { usePrevious } from "@bratislava/utils";
import { Feature, FeatureCollection, Point } from "geojson";
import {
  DIGUPS_URL,
  DISORDERS_URL,
  REPAIRS_2022_ODP_POLYGONS_URL,
  REPAIRS_2022_POLYGONS_URL,
  REPAIRS_2022_RECONSTRUCTION_DESIGN_POLYGONS_URL,
  REPAIRS_2022_ZEBRA_CROSSING_POINTS_URL,
} from "../utils/urls";
import { processData } from "../utils/utils";
import Detail from "./Detail";
import { Filters } from "./Filters";
import { ILayerCategory } from "./Layers";
import { MobileHeader } from "./mobile/MobileHeader";

import { Icon } from "./Icon";
import { Marker } from "./Marker";
import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";

const REPAIRS_POINTS_URLS = [REPAIRS_2022_ZEBRA_CROSSING_POINTS_URL];

const REPAIRS_POLYGONS_URLS = [
  REPAIRS_2022_ODP_POLYGONS_URL,
  REPAIRS_2022_RECONSTRUCTION_DESIGN_POLYGONS_URL,
  REPAIRS_2022_POLYGONS_URL,
];

export const App = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  const [isLoading, setLoading] = useState(true);

  const [markersData, setMarkersData] = useState<FeatureCollection | null>(null);

  const [repairsPolygonsData, setRepairsPolygonsData] = useState<FeatureCollection | null>(null);

  const { data: rawDisordersData } = useArcgis(DISORDERS_URL);
  const { data: rawDigupsAndClosuresData } = useArcgis(DIGUPS_URL);

  const { data: rawRepairsPointsData } = useArcgis(REPAIRS_POINTS_URLS);
  const { data: rawRepairsPolygonsData } = useArcgis(REPAIRS_POLYGONS_URLS);

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Feature<Point> | null>(null);

  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueLayers, setUniqueLayers] = useState<string[]>([]);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  useEffect(() => {
    if (
      rawDisordersData &&
      rawDigupsAndClosuresData &&
      rawRepairsPointsData &&
      rawRepairsPolygonsData
    ) {
      const { markersData, repairsPolygonsData, uniqueDistricts, uniqueLayers, uniqueTypes } =
        processData({
          rawDisordersData,
          rawDigupsAndClosuresData,
          rawRepairsPointsData,
          rawRepairsPolygonsData,
        });

      setMarkersData(markersData);
      setRepairsPolygonsData(repairsPolygonsData);

      setUniqueDistricts(uniqueDistricts);
      setUniqueLayers(uniqueLayers);
      setUniqueTypes(uniqueTypes);

      setLayerCategories([
        {
          label: t("layers.digups.title"),
          icon: <Icon icon="digup" size={40} />,
          subLayers: ["digups"],
        },
        {
          label: t("layers.closures.title"),
          icon: <Icon icon="closure" size={40} />,
          subLayers: ["closures"],
        },
        {
          label: t("layers.disorders.title"),
          icon: <Icon icon="disorder" size={40} />,
          subLayers: ["disorders"],
        },
        {
          label: t("layers.repairs.title"),
          icon: <Icon icon="repair" size={40} />,
          subLayers: ["repairs"],
        },
      ]);

      setLoading(false);
    }
  }, [rawDisordersData, rawDigupsAndClosuresData, rawRepairsPointsData, rawRepairsPolygonsData, t]);

  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const mapRef = useRef<MapHandle>(null);

  const [isMobile, setMobile] = useState<boolean | null>(null);
  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  // close sidebar on mobile and open on desktop
  useEffect(() => {
    // from mobile to desktop
    if (previousMobile == true && isMobile == false) {
      setSidebarVisible(true);
    }
    // from desktop to mobile
    if (previousMobile == false && isMobile == true) {
      setSidebarVisible(false);
    }
  }, [isMobile, previousMobile]);

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

  const selectedFeatures = useMemo(() => {
    return selectedFeature ? [selectedFeature] : [];
  }, [selectedFeature]);

  const onFeaturesClick = useCallback((features: MapboxGeoJSONFeature[]) => {
    mapRef.current?.moveToFeatures(features);
    setSelectedFeature(features[0] ?? null);
    setSelectedMarker(null);
  }, []);

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  // fit to district
  useEffect(() => {
    mapRef.current?.fitDistrict(districtFilter.activeKeys);
  }, [districtFilter.activeKeys]);

  const typeFilter = useFilter({
    property: "type",
    comparator: useCallback(({ value, property }: { value: string; property: string }) => {
      return ["in", value, ["get", property]];
    }, []),
    keys: uniqueTypes,
  });

  const statusFilter = useFilter({
    property: "status",
    combiner: "any",
    keys: useMemo(() => ["planned", "active", "done"], []),
    defaultValues: useMemo(() => ({ planned: false, active: true, done: false }), []),
  });

  const layerfilter = useFilter({
    property: "layer",
    keys: uniqueLayers,
    defaultValues: useMemo(
      () =>
        uniqueLayers.reduce(
          (prev, curr) => ({ ...prev, [curr]: curr === "repairs" ? false : true }),
          {},
        ),
      [uniqueLayers],
    ),
  });

  // Date filter
  const [dateStart, setDateStart] = useState<DateValue>();
  const [dateEnd, setDateEnd] = useState<DateValue>();

  const dateFilterExpression = useMemo(() => {
    if (!dateStart || !dateEnd) return null;

    const startTimestamp = dateStart.toDate("Europe/Bratislava").getTime();
    const endTimestamp = dateEnd.toDate("Europe/Bratislava").getTime();

    return [
      "any",
      ["all", ["<=", "startTimestamp", startTimestamp], [">=", "endTimestamp", startTimestamp]],
      ["all", ["<=", "startTimestamp", endTimestamp], [">=", "endTimestamp", endTimestamp]],
    ];
  }, [dateStart, dateEnd]);

  const previousDateFilterExpression = usePrevious(dateFilterExpression);

  useEffect(() => {
    // When dateFilter is set, then set active all keys from statusFilter
    if (dateFilterExpression !== null && previousDateFilterExpression === null) {
      if (statusFilter.activeKeys.length !== statusFilter.keys.length) {
        statusFilter.setActiveAll(true);
      }
    }
  }, [dateFilterExpression, previousDateFilterExpression, statusFilter]);

  useEffect(() => {
    // When statusFilter changes, disable dateFilter
    if (statusFilter.activeKeys.length !== statusFilter.keys.length) {
      setDateStart(undefined);
      setDateEnd(undefined);
    }
  }, [statusFilter.activeKeys.length, statusFilter.keys.length]);

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
        filter: typeFilter,
        mapToActive: (activeTypes) => ({
          title: t("filters.type.title"),
          items: activeTypes.map((type) => t(`filters.type.types.${type}`)),
        }),
      },
      {
        filter: statusFilter,
        mapToActive: (activeStatuses) => ({
          title: t("filters.status.title"),
          items: activeStatuses.map((status) => t(`filters.status.${status}`)),
        }),
      },
      {
        onlyInExpression: true,
        filter: layerfilter,
        mapToActive: (activeLayers) => ({
          title: t("layers"),
          items: activeLayers.map((l) => t(`layers.${l}.title`)),
        }),
      },
    ],
  });

  const finalCombinedFilter = useMemo(() => {
    if (dateFilterExpression) {
      return [...combinedFilter.expression, dateFilterExpression];
    }
    return combinedFilter.expression;
  }, [combinedFilter.expression, dateFilterExpression]);

  const combinedFilterWithoutStatus = useCombinedFilter({
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
        onlyInExpression: true,
        filter: layerfilter,
        mapToActive: (activeLayers) => ({
          title: t("layers"),
          items: activeLayers.map((l) => t(`layers.${l}.title`)),
        }),
      },
    ],
  });

  const [layerCategories, setLayerCategories] = useState<ILayerCategory[]>([]);

  const { height: viewportControlsHeight = 0, ref: viewportControlsRef } = useResizeDetector();
  const { height: detailHeight = 0, ref: detailRef } = useResizeDetector();

  const { height: windowHeight } = useWindowSize();

  const shouldBeViewportControlsMoved = useMemo(() => {
    return windowHeight < viewportControlsHeight + detailHeight + 40;
  }, [windowHeight, detailHeight, viewportControlsHeight]);

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#0F6D95"
      initialViewport={initialViewport}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={mapStyles}
      isOutsideLoading={isLoading}
      onFeaturesClick={onFeaturesClick}
      selectedFeatures={selectedFeatures}
      onMobileChange={setMobile}
      onMapClick={closeDetail}
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
      <Filter expression={finalCombinedFilter}>
        <Cluster features={markersData?.features ?? []} radius={64}>
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
      <Layer
        filters={combinedFilterWithoutStatus.expression}
        geojson={repairsPolygonsData}
        styles={REPAIRS_POLYGONS_STYLE}
      />
      <Layer
        filters={districtFilter.keepOnEmptyExpression}
        ignoreClick
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
              slots={[["compass", "zoom"]]}
              desktopSlots={["geolocation", "compass", ["fullscreen", "zoom"]]}
            />
          </div>
        </div>
        <div className="pointer-events-auto shadow-lg rounded-lg sm:hidden">
          <SearchBar placeholder={t("search")} language={i18n.language} direction="top" />
        </div>
      </Slot>

      <Layout isOnlyMobile>
        <Slot id="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>

        <Slot
          id="mobile-detail"
          isVisible={!!(selectedFeature ?? selectedMarker)}
          position="bottom"
        >
          <Detail
            ref={detailRef}
            feature={selectedFeature ?? selectedMarker}
            isMobile={true}
            onClose={closeDetail}
          />
        </Slot>
      </Layout>

      <Layout isOnlyDesktop>
        <Slot
          id="desktop-detail"
          autoPadding
          isVisible={!!(selectedFeature ?? selectedMarker)}
          avoidMapboxControls
          position="top-right"
        >
          <Detail
            ref={detailRef}
            feature={selectedFeature ?? selectedMarker}
            isMobile={false}
            onClose={closeDetail}
          />
        </Slot>
      </Layout>

      <Filters
        isMobile={isMobile ?? false}
        isVisible={isSidebarVisible}
        setVisible={(isVisible) => setSidebarVisible(isVisible ?? false)}
        districtFilter={districtFilter}
        areFiltersDefault={combinedFilter.areDefault && dateFilterExpression === null}
        activeFilters={combinedFilter.active}
        onResetFiltersClick={() => {
          combinedFilter.reset();
          setDateStart(undefined);
          setDateEnd(undefined);
        }}
        layerFilter={layerfilter}
        layerCategories={layerCategories}
        statusFilter={statusFilter as IFilterResult<string>}
        typeFilter={typeFilter}
        dateStart={dateStart}
        dateEnd={dateEnd}
        onDateStartChange={setDateStart}
        onDateEndChange={setDateEnd}
      />
    </Map>
  );
};

export default App;
