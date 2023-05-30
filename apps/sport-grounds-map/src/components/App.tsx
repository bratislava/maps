import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useResizeDetector } from "react-resize-detector";
import "../styles.css";

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

import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";

// maps
import { Cluster, Filter, Layer, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";

// components
import { Detail } from "./Detail";

// utils
import { Feature, FeatureCollection, Point } from "geojson";
import { processData } from "../utils/utils";
import { DesktopFilters } from "./desktop/DesktopFilters";
import { MobileFilters } from "./mobile/MobileFilters";
import { MobileHeader } from "./mobile/MobileHeader";

import { ILayerGroup, Modal, Sidebar } from "@bratislava/react-maps-ui";
import { usePrevious } from "@bratislava/utils";
import DISTRICTS_STYLE from "../data/districts/districts";
import { Icon, IIconProps } from "./Icon";
import { Legend } from "./Legend";
import { Marker } from "./Marker";
import { MultipleMarker } from "./MultipleMarker";
import { IPool, IWorkout } from "../data/types";

const querySwimmingPools = "https://general-strapi.bratislava.sk/api/kupaliskas?populate=*&pagination[limit]=-1";
const queryWorkouts = "https://general-strapi.bratislava.sk/api/cvickas?populate=*&pagination[limit]=-1";

export const App = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  const [data, setData] = useState<FeatureCollection | null>(null);

  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [isLegendOpen, setLegendOpen] = useState(false);

  const [frameState, setFrameState] = useState<boolean>(false);
  const frameStateSideBar = useRef(isSidebarVisible);

  const [rawDataPools, setRawDataPools] = useState<Array<IPool>>();
  const [rawDataCvicko, setRawDataCvicko] = useState<Array<IWorkout>>()

  useEffect(() => {
    fetch(querySwimmingPools, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => JSON.stringify(setRawDataPools(response.data)));

    fetch(queryWorkouts, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => JSON.stringify(setRawDataCvicko(response.data)))
  }, []);

  useEffect(() => {
    if (rawDataPools && rawDataCvicko) {
      const { data, uniqueDistricts } = processData({ rawDataPools, rawDataCvicko });

      setData(data);
      setUniqueDistricts(uniqueDistricts);

    }

  }, [rawDataPools, rawDataCvicko]);

  const mapRef = useRef<MapHandle>(null);

  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  const layerFilter = useFilter({
    property: "layer",
    keys: useMemo(() => ["swimmingPools", "cvicko"], []),
    defaultValues: useMemo(
      () => ({
        cvicko: true,
        swimmingPools: true,
      }),
      [],
    ),
  });

  const handleSideBar = useCallback((value: boolean, changePrevious: boolean) => {
    if (changePrevious) frameStateSideBar.current = value;
    setSidebarVisible(value);
  }, [])

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

    (window === window.parent || isMobile) ? setFrameState(false) : setFrameState(true);

  }, [previousMobile, isMobile, handleSideBar]);

  const isDetailOpen = useMemo(() => !!selectedFeature, [selectedFeature]);

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  useEffect(() => {
    if (!frameState) return;

    if (selectedFeature) {
      handleSideBar(false, false)
    }
    else {
      handleSideBar(frameStateSideBar.current, true)
    }
  }, [frameState, selectedFeature, handleSideBar])

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
        filter: layerFilter,
        onlyInExpression: true,
        mapToActive: (activeLayers) => ({
          title: "Layers",
          items: activeLayers,
        }),
      },
    ],
  });

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
          lat: 48.1688598,
          lng: 17.107748,
        },
        zoom: !isMobile ? 12 : 10.4,
      })
      : mapRef.current?.fitDistrict(districtFilter.activeKeys);
  }, [districtFilter.activeKeys, mapRef, isMobile]);

  const markerClickHandler = useCallback((feature: Feature<Point>) => {
    setSelectedFeature(feature);
    mapRef.current?.changeViewport({
      center: {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      },
    });
  }, []);

  const { height: desktopDetailHeight, ref: desktopDetailRef } =
    useResizeDetector<HTMLDivElement>();

  const layerToIconMappingObject: { [layer: string]: IIconProps["icon"] } = useMemo(
    () => ({
      cvicko: "cvicko",
      swimmingPools: "pool",
    }),
    [],
  );

  const layerGroups: ILayerGroup<(typeof layerFilter.keys)[0]>[] = useMemo(
    () =>
      layerFilter.keys.map((layerKey) => ({
        label: t(`layers.${layerKey}.title`),
        icon: (
          <div className="bg-primary rounded-full text-white">
            <Icon size={40} icon={layerToIconMappingObject[layerKey]} />
          </div>
        ),
        layers: { value: layerKey, isActive: layerFilter.isAnyKeyActive([layerKey]) },
      })),
    [layerFilter, layerToIconMappingObject, t],
  );

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

  const [moveController, setMoveController] = useState(false);

  useEffect(() => {

    const controllerSpaceHandler = (): boolean => {
      const windowHeight = window.innerHeight;
      return (selectedFeature && windowHeight < 900 && !isMobile) || selectedFeature?.properties?.layer === "swimmingPools" && !isMobile;
    }

    setMoveController(controllerSpaceHandler());

  }, [selectedFeature, isMobile])

  return (
    <Map
      ref={mapRef}
      minZoom={!isMobile ? 10.8 : 10.4}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={initialViewport}
      isDevelopment={import.meta.env.DEV}
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
      <Layer
        ignoreClick
        filters={districtFilter.keepOnEmptyExpression}
        geojson={DISTRICTS_GEOJSON}
        styles={DISTRICTS_STYLE}
      />

      <Filter expression={combinedFilter.expression}>
        <Cluster features={data?.features ?? []} radius={24}>
          {({ features, lng, lat, key, clusterExpansionZoom }) =>
            features.length === 1 ? (
              <Marker
                isSelected={features[0].id === selectedFeature?.id}
                key={key}
                feature={features[0]}
                onClick={markerClickHandler}
              />
            ) : (
              <MultipleMarker
                isSelected={features.findIndex(f => f.id === selectedFeature?.id) > -1}
                key={key}
                features={features}
                lat={lat}
                lng={lng}
                onClick={() =>
                  mapRef.current?.changeViewport({
                    zoom: clusterExpansionZoom ?? 0,
                    center: {
                      lat,
                      lng,
                    },
                  })
                }
              />
            )
          }
        </Cluster>
      </Filter>

      <Slot id="controls">
        <ThemeController
          className={cx("fixed left-4 bottom-[88px] sm:bottom-8 sm:transform", {
            "translate-x-96": isSidebarVisible && !isMobile,
          })}
        />
        <ViewportController
          className={cx("fixed right-4 bottom-[88px] sm:bottom-8", {
            "-translate-x-96 delay-75": moveController,
            "translate-x-0 delay-200": !moveController,
          })}
          slots={["legend", "compass", "zoom"]}
          desktopSlots={["legend", "geolocation", "compass", ["fullscreen", "zoom"]]}
          onLegendOpenChange={setLegendOpen}
          isLegendOpen={isLegendOpen}
        />
        <div className="fixed bottom-8 left-4 right-4 z-10 shadow-lg rounded-lg sm:hidden">
          <SearchBar placeholder={t("search")} language={i18n.language} direction="top" />
        </div>
      </Slot>

      <Layout isOnlyMobile>
        <Slot id="mobile-header">
          <MobileHeader
            onFunnelClick={() => handleSideBar(!isSidebarVisible, true)}
          />
        </Slot>

        <Slot id="mobile-filter" isVisible={isSidebarVisible} position="top-right">
          <MobileFilters
            isVisible={isSidebarVisible}
            setVisible={(isVisible) => handleSideBar(isVisible, true)}
            areFiltersDefault={combinedFilter.areDefault}
            activeFilters={combinedFilter.active}
            onResetFiltersClick={combinedFilter.reset}
            districtFilter={districtFilter}
            layerFilter={layerFilter}
            layerGroups={layerGroups}
          />
        </Slot>

        <Slot id="mobile-detail" isVisible={true}>
          <Detail isMobile feature={selectedFeature} onClose={closeDetail} />
        </Slot>

        <Slot id="mobile-legend" isVisible={isLegendOpen} position="top-right">
          <Sidebar
            title={t("title")}
            isMobile
            isVisible={isLegendOpen}
            position="right"
            closeText={t("close")}
            onClose={() => setLegendOpen(false)}
            onOpen={() => setLegendOpen(true)}
          >
            <div className="px-6 py-2">
              <Legend />
            </div>
          </Sidebar>
        </Slot>
      </Layout>
      <Layout isOnlyDesktop>
        <Slot
          id="desktop-filters"
          isVisible={isSidebarVisible}
          position="top-left"
          autoPadding
          avoidMapboxControls
        >
          <DesktopFilters
            isVisible={isSidebarVisible}
            setVisible={(isVisible) => handleSideBar(isVisible, true)}
            areFiltersDefault={combinedFilter.areDefault}
            onResetFiltersClick={combinedFilter.reset}
            districtFilter={districtFilter}
            layerFilter={layerFilter}
            layerGroups={layerGroups}
          />
        </Slot>

        <Slot id="desktop-detail" isVisible={isDetailOpen} position="top-right" autoPadding>
          <div
            ref={desktopDetailRef}
            className={cx("w-96", {
              "shadow-lg": isDetailOpen,
            })}
          >
            <Detail isMobile={false} feature={selectedFeature} onClose={closeDetail} />
          </div>
        </Slot>

        <Slot id="desktop-legend">
          <Modal closeButtonInCorner isOpen={isLegendOpen} onClose={() => setLegendOpen(false)}>
            <Legend />
          </Modal>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
