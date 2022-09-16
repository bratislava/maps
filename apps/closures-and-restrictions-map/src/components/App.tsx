import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import "../styles.css";

// maps
import { Cluster, Filter, Layer, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";
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
import { useArcgis } from "@bratislava/react-use-arcgis";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";

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
import { MobileSearch } from "./mobile/MobileSearch";

import { Icon } from "./Icon";
import { Marker } from "./Marker";

const REPAIRS_POINTS_URLS = [REPAIRS_2022_ZEBRA_CROSSING_POINTS_URL];

const REPAIRS_POLYGONS_URLS = [
  REPAIRS_2022_ODP_POLYGONS_URL,
  REPAIRS_2022_RECONSTRUCTION_DESIGN_POLYGONS_URL,
  REPAIRS_2022_POLYGONS_URL,
];

export const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("title");
  }, [t]);

  const [isLoading, setLoading] = useState(true);

  const [markersData, setMarkersData] = useState<FeatureCollection | null>(null);

  const [repairsPolygonsData, setRepairsPolygonsData] = useState<FeatureCollection | null>(null);
  const [isGeolocation, setGeolocation] = useState(false);

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
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

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
      REPAIRS_POLYGONS_DATA: repairsPolygonsData,
      DISTRICTS_GEOJSON,
    }),
    [repairsPolygonsData],
  );

  const selectedFeatures = useMemo(() => {
    return selectedFeature ? [selectedFeature] : [];
  }, [selectedFeature]);

  const onFeaturesClick = useCallback((features: MapboxGeoJSONFeature[]) => {
    mapRef.current?.moveToFeatures(features);
    setSelectedFeature(features[0] ?? null);
    setSelectedMarker(null);
  }, []);

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile ? ["compass", "zoom"] : ["geolocation", "compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

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

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#0F6D95"
      initialViewport={initialViewport}
      ref={mapRef}
      mapboxgl={mapboxgl}
      mapStyles={mapStyles}
      sources={sources}
      isOutsideLoading={isLoading}
      onFeaturesClick={onFeaturesClick}
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
      <Filter expression={combinedFilter.expression}>
        <Cluster features={markersData?.features ?? []} radius={64}>
          {({ features, lng, lat, key, clusterExpansionZoom }) => (
            <Marker
              isSelected={features[0].id === selectedMarker?.id}
              key={key}
              features={features}
              lat={lat}
              lng={lng}
              onClick={(feature) => {
                console.log(features[0]);
                console.log(selectedMarker);
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
        source="REPAIRS_POLYGONS_DATA"
        styles={REPAIRS_POLYGONS_STYLE}
      />
      <Layer
        filters={districtFilter.expression}
        ignoreClick
        source="DISTRICTS_GEOJSON"
        styles={DISTRICTS_STYLE}
      />

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
        <MobileSearch mapRef={mapRef} mapboxgl={mapboxgl} isGeolocation={isGeolocation} />
      </Slot>

      <Layout isOnlyMobile>
        <Slot name="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>
      </Layout>

      <Filters
        mapboxgl={mapboxgl}
        mapRef={mapRef}
        isGeolocation={isGeolocation}
        isMobile={isMobile ?? false}
        isVisible={isSidebarVisible}
        setVisible={(isVisible) => setSidebarVisible(isVisible ?? false)}
        districtFilter={districtFilter}
        areFiltersDefault={combinedFilter.areDefault}
        activeFilters={combinedFilter.active}
        onResetFiltersClick={combinedFilter.reset}
        layerFilter={layerfilter}
        layerCategories={layerCategories}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />

      <Detail
        feature={selectedFeature ?? selectedMarker}
        isMobile={isMobile ?? false}
        onClose={closeDetail}
      />
    </Map>
  );
};

export default App;
