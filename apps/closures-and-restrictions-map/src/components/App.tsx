import { DateValue } from "@react-types/calendar";
import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useResizeDetector } from "react-resize-detector";
import { useWindowSize } from "usehooks-ts";
import "../styles.css";

// NOTE: "Repair layers was removed by comments in Commit "Repair Layesrs Removed" at 7.2.2023
// TODO: if you need to return those Layers just revert changes/or uncomment them"

// maps
import {
  Cluster,
  Filter,
  IFilterResult,
  Layer,
  useCombinedFilter,
  useFilter,
  useMarkerOrFeaturesInQuery,
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
// import REPAIRS_POLYGONS_STYLE from "../assets/layers/repairs/repairsPolygons";

// utils
import { usePrevious } from "@bratislava/utils";
import { Feature, FeatureCollection, Point } from "geojson";
import { DIGUPS_URL, DISORDERS_URL, STRAPI_NOTIFICATIONS_URL } from "../utils/urls";
import { processData } from "../utils/utils";
import Detail from "./Detail";
import { Filters } from "./Filters";
import { MobileHeader } from "./mobile/MobileHeader";

import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";
import { Information } from "@bratislava/react-maps-icons";
import { Modal } from "@bratislava/react-maps-ui";
import { IMapInfoNotification } from "@bratislava/react-maps/src/components/Map/types";
import { colors } from "../utils/colors";
import { Marker } from "./Marker";
import TextWithAnchorLink from "./TextWithAnchorLink";

// const REPAIRS_POINTS_URLS = [REPAIRS_2022_ZEBRA_CROSSING_POINTS_URL];

// const REPAIRS_POLYGONS_URLS = [
//   REPAIRS_2022_ODP_POLYGONS_URL,
//   REPAIRS_2022_RECONSTRUCTION_DESIGN_POLYGONS_URL,
//   REPAIRS_2022_POLYGONS_URL,
// ];

export interface ITooltip {
  name: string;
  title: string;
  description: string;
}

interface IStrapiNotification {
  title: string;
  description: string;
  enabled: boolean;
  cratedAt: Date;
  updatedAt: Date;
  locale: string;
}

export const tooltips: Array<ITooltip> = [
  {
    name: "state",
    title: "",
    description:
      "Stav plánované zobrazuje body, ktorých dátum začiatku realizácie je neskôr ako aktuálny čas. Stav aktuálne zobrazuje body, ktorých začiatok je skôr a zároveň koniec neskôr ako aktuálny čas.",
  },
];

export const App = () => {
  const { t, i18n }: { t: (key: string) => string; i18n: { language: string } } = useTranslation();

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  const [isLoading, setLoading] = useState(true);

  const [markersData, setMarkersData] = useState<FeatureCollection | null>(null);

  // const [repairsPolygonsData, setRepairsPolygonsData] = useState<FeatureCollection | null>(null);

  const { data: rawDisordersData } = useArcgis(DISORDERS_URL);
  const { data: rawDigupsAndClosuresData } = useArcgis(DIGUPS_URL);

  // const { data: rawRepairsPointsData } = useArcgis(REPAIRS_POINTS_URLS);
  // const { data: rawRepairsPolygonsData } = useArcgis(REPAIRS_POLYGONS_URLS);

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Feature<Point> | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  const [uniqueDistricts, setUniqueDistricts] = useState<Array<string>>([]);
  const [uniqueLayers, setUniqueLayers] = useState<Array<string>>([]);
  const [uniqueTypes, setUniqueTypes] = useState<Array<string>>([]);

  const [strapiNotification, setStrapiNotification] = useState<IStrapiNotification>(
    {} as IStrapiNotification,
  );

  useMarkerOrFeaturesInQuery({
    markersData,
    selectedMarker,
    zoomAtWhichMarkerWasSelected: zoom,
    setSelectedMarkerAndZoom: (feature, requiredZoom) => {
      setSelectedMarker(feature);
      const f = feature as Feature<Point>;
      mapRef.current?.changeViewport({
        zoom: Math.max(requiredZoom ?? 0, 14),
        center: {
          lng: f?.geometry?.coordinates[0],
          lat: f?.geometry?.coordinates[1],
        },
      });
    },
  });

  useEffect(() => {
    fetch(STRAPI_NOTIFICATIONS_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => JSON.stringify(setStrapiNotification(response.data.attributes)));
  }, []);

  useEffect(() => {
    if (
      rawDisordersData &&
      rawDigupsAndClosuresData
      // rawRepairsPointsData &&
      // rawRepairsPolygonsData
    ) {
      const {
        markersData,
        // repairsPolygonsData,
        uniqueDistricts,
        uniqueLayers,
        uniqueTypes,
      } = processData({
        rawDisordersData,
        rawDigupsAndClosuresData,
        // rawRepairsPointsData,
        // rawRepairsPolygonsData,
      });

      setMarkersData(markersData);
      // setRepairsPolygonsData(repairsPolygonsData);

      setUniqueDistricts(uniqueDistricts);
      setUniqueLayers(uniqueLayers);
      setUniqueTypes(uniqueTypes);

      setLoading(false);
    }
  }, [
    rawDisordersData,
    rawDigupsAndClosuresData,
    // rawRepairsPointsData,
    // rawRepairsPolygonsData,
    t,
  ]);

  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const mapRef = useRef<MapHandle>(null);

  const [isMobile, setMobile] = useState<boolean>(false);
  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const [frameState, setFrameState] = useState<boolean>(false);
  const frameStateSideBar = useRef(isSidebarVisible);

  const [isTooltipModalOpen, setTooltipModalOpen] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<ITooltip | null>(null);
  const closeTooltipModal = () => setTooltipModalOpen(false);

  const modalHandler = useCallback(
    (tooltip: ITooltip | null) => {
      setActiveTooltip(tooltip);
      tooltip && isMobile && setTooltipModalOpen(true);

      !tooltip && setTooltipModalOpen(false);
    },
    [isMobile],
  );

  const handleSideBar = useCallback((value: boolean, changePrevious: boolean) => {
    if (changePrevious) frameStateSideBar.current = value;
    setSidebarVisible(value);
  }, []);

  // close sidebar on mobile and open on desktop
  useEffect(() => {
    // from mobile to desktop
    if (previousMobile == true && !isMobile) {
      handleSideBar(true, true);
    }
    // from desktop to mobile
    if (previousMobile == false && isMobile) {
      handleSideBar(false, true);
    }

    window === window.parent || isMobile ? setFrameState(false) : setFrameState(true);

    modalHandler(null);
  }, [isMobile, previousMobile, modalHandler, handleSideBar]);

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
    setSelectedMarker(null);
    // setClusterExpansionZoom(null);
  }, []);

  useEffect(() => {
    if (!frameState) return;

    if (selectedMarker) {
      handleSideBar(false, false);
    } else {
      handleSideBar(frameStateSideBar.current, true);
    }
  }, [frameState, selectedMarker, handleSideBar]);

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
  }, [closeDetail, isMobile, isSidebarVisible, previousSidebarVisible]);

  // TODO wrong viewport, change to the center of BA
  const initialViewport = {
    zoom: !isMobile ? 12 : 10.4,
    center: {
      lat: 48.1688598,
      lng: 17.107748,
    },
  };

  const mapStyles = {
    light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
    dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
  };

  const selectedFeatures = useMemo(() => {
    return selectedFeature ? [selectedFeature] : [];
  }, [selectedFeature]);

  const onFeaturesClick = (features: Array<MapboxGeoJSONFeature>) => {
    mapRef.current?.moveToFeatures(features);
    setSelectedFeature(features[0] ?? null);
    setSelectedMarker(null);
    // setClusterExpansionZoom(null);
  };

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
  const [dateStart, setDateStart] = useState<DateValue | undefined>();
  const [dateEnd, setDateEnd] = useState<DateValue | undefined>();

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

  const infoNotification: IMapInfoNotification | undefined =
    strapiNotification.enabled && strapiNotification.description && strapiNotification.title
      ? {
          title: strapiNotification?.title,
          txt: <TextWithAnchorLink text={strapiNotification?.description} />,
          moreTxt: t("informationModal.moreInfo"),
        }
      : undefined;

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

  const { height: viewportControlsHeight = 0, ref: viewportControlsRef } = useResizeDetector();
  const { height: detailHeight = 0, ref: detailRef } = useResizeDetector();

  const { height: windowHeight } = useWindowSize();

  const shouldBeViewportControlsMoved = useMemo(() => {
    return !isMobile && windowHeight < viewportControlsHeight + detailHeight + 40;
  }, [windowHeight, detailHeight, viewportControlsHeight, isMobile]);

  const onFilterReset = () => {
    combinedFilter.reset();
    setDateStart(undefined);
    setDateEnd(undefined);
  };

  return isLoading ? null : (
    <Map
      loadingSpinnerColor={colors.defaultBlue}
      initialViewport={initialViewport}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={mapStyles}
      onFeaturesClick={onFeaturesClick}
      selectedFeatures={selectedFeatures}
      onMobileChange={setMobile}
      onMapClick={closeDetail}
      onViewportChangeDebounced={(viewport) => {
        setZoom(viewport.zoom);
      }}
      mapInformation={{
        // Comment out/remove infoNotification attribute to remove notification
        infoNotification,
        title: t("informationModal.title"),
        description: (
          <>
            <div className="mb-2">{t("informationModal.descriptionPart1")}</div>
            <div className="mb-2">
              <Trans i18nKey="informationModal.descriptionPart2">
                before
                <a
                  href={t("informationModal.description2Link")}
                  className="underline font-semibold"
                  target="_blank"
                  rel="noreferrer"
                >
                  link
                </a>
              </Trans>
            </div>
            <div>
              <Trans i18nKey="informationModal.descriptionPart3">
                before
                <a
                  href={t("informationModal.description3Link")}
                  className="underline font-semibold"
                  target="_blank"
                  rel="noreferrer"
                >
                  link
                </a>
              </Trans>
            </div>
            <div className="flex gap-2 mt-[36px]">
              <Information className="mt-[2px]" size="md" />
              <p>{t("informationModal.info")}</p>
            </div>
            <div className="ml-[30px] mt-[12px]">
              <a
                href={t("informationModal.reportProblemLink")}
                target="_blank"
                className="underline font-semibold text-[#15254B] dark:text-[#ffffff]"
                rel="noreferrer"
              >
                {t("informationModal.reportProblem")}
              </a>
            </div>
          </>
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
      <Filter expression={finalCombinedFilter}>
        <Cluster features={markersData?.features ?? []} radius={44} splitPoints>
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
      {/* <Layer
        filters={combinedFilterWithoutStatus.expression}
        geojson={repairsPolygonsData}
        styles={REPAIRS_POLYGONS_STYLE}
      /> */}
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

      <Detail
        ref={detailRef}
        feature={selectedFeature ?? selectedMarker}
        isMobile={isMobile}
        onClose={closeDetail}
      />

      <Layout isOnlyMobile>
        <Slot id="mobile-header">
          <MobileHeader onFunnelClick={() => handleSideBar(!isSidebarVisible, true)} />
        </Slot>
      </Layout>

      <Layout isOnlyDesktop></Layout>

      <Filters
        isMobile={isMobile ?? false}
        isVisible={isSidebarVisible}
        setVisible={(isVisible) => handleSideBar(isVisible ?? false, true)}
        districtFilter={districtFilter}
        areFiltersDefault={combinedFilter.areDefault && dateFilterExpression === null}
        activeFilters={combinedFilter.active}
        onResetFiltersClick={() => onFilterReset()}
        layerFilter={layerfilter}
        statusFilter={statusFilter as IFilterResult<string>}
        typeFilter={typeFilter}
        dateStart={dateStart}
        dateEnd={dateEnd}
        onDateStartChange={setDateStart}
        onDateEndChange={setDateEnd}
        modalHandler={modalHandler}
      />

      <Modal
        overlayClassName="max-w-lg"
        isOpen={isTooltipModalOpen && !!activeTooltip}
        title={activeTooltip?.title}
        description={activeTooltip?.description}
        onClose={closeTooltipModal}
      ></Modal>
    </Map>
  );
};

export default App;
