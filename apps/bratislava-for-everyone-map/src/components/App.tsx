import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
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

import { useResizeDetector } from "react-resize-detector";
import { useWindowSize } from "usehooks-ts";

import { Cluster, Filter, Layer, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";

// layer styles
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
import { usePrevious } from "@bratislava/utils";
import { processData } from "../utils/utils";
import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";
import { FeatureCollection, Point, Feature } from "geojson";
import { IconButton } from "@bratislava/react-maps-ui";
import { Funnel } from "@bratislava/react-maps-icons";
import { Filters } from "./Filters";
import Detail from "./Detail";
import { PhoneLinksModal } from "./PhoneLinksModal";
import { Marker } from "./Marker";
import { colors } from "../utils/colors";
import { drinkingFountainsData } from "../data/drinking-fountains";
import { point } from "@turf/helpers";
import { DrinkingFountainMarker } from "./DrinkingFountainMarker";

export const App = () => {
  const { t, i18n } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection<Point> | null>(null);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueLayers, setUniqueLayers] = useState<string[]>([]);

  useEffect(() => {
    document.title = t("tabTitle");
  }, [t]);

  useEffect(() => {
    const { data, uniqueDistricts } = processData();
    setLoading(false);
    setUniqueDistricts(uniqueDistricts);
    setUniqueLayers(Object.keys(colors));
    setData(data);
  }, []);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);

  const mapRef = useRef<MapHandle>(null);

  const [selectedMarker, setSelectedMarker] = useState<Feature<Point> | null>(null);

  useEffect(() => {
    console.log("selectedMarker", selectedMarker);
  }, [selectedMarker]);

  const [isMobile, setMobile] = useState<boolean | null>(null);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  const layerFilter = useFilter({
    property: "subLayerName",
    keys: uniqueLayers,
    defaultValues: useMemo(
      () => uniqueLayers.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}),
      [uniqueLayers],
    ),
  });

  const layerFilterFixedExpression = useMemo(() => {
    const result: any[] = ["any"];
    if (layerFilter.isAnyKeyActive(["counseling"])) result.push(["==", "isCounseling", true]);
    if (layerFilter.isAnyKeyActive(["hygiene"])) result.push(["==", "isHygiene", true]);
    if (layerFilter.isAnyKeyActive(["overnight"])) result.push(["==", "isOvernight", true]);
    if (layerFilter.isAnyKeyActive(["meals"])) result.push(["==", "isMeals", true]);
    if (layerFilter.isAnyKeyActive(["medicalTreatment"]))
      result.push(["==", "isMedicalTreatment", true]);
    if (layerFilter.isAnyKeyActive(["culture"])) result.push(["==", "isCulture", true]);
    return result;
  }, [layerFilter]);

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
    ],
  });

  const closeDetail = useCallback(() => {
    setSelectedMarker(null);
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
    if (MAP && selectedMarker) {
      setTimeout(() => {
        mapRef.current?.moveToFeatures(selectedMarker);
      }, 0);
    }
  }, [selectedMarker]);

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

  const { height: viewportControlsHeight = 0, ref: viewportControlsRef } = useResizeDetector();
  const { height: detailHeight = 0, ref: detailRef } = useResizeDetector();

  const { height: windowHeight } = useWindowSize();

  const shouldBeViewportControlsMoved = useMemo(() => {
    return windowHeight < viewportControlsHeight + detailHeight + 40 && !!selectedMarker;
  }, [windowHeight, detailHeight, viewportControlsHeight, selectedMarker]);

  const shouldBeBottomLeftCornerRounded = useMemo(() => {
    return windowHeight !== detailHeight;
  }, [windowHeight, detailHeight]);

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#F1B830"
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={initialViewport}
      isDevelopment={import.meta.env.DEV}
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

      <Cluster features={drinkingFountainsData.features} radius={24}>
        {({ features, lng, lat, key, clusterExpansionZoom }) =>
          features.length === 1 ? (
            <DrinkingFountainMarker
              isSelected={!!(selectedMarker && features[0].id === selectedMarker.id)}
              key={key}
              feature={features[0]}
              onClick={() => setSelectedMarker(features[0])}
            />
          ) : (
            <DrinkingFountainMarker
              key={key}
              feature={point([lng, lat], features[0].properties)}
              count={features.length}
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

      <Filter expression={layerFilterFixedExpression}>
        {data?.features.map((feature, index) => (
          <Marker
            key={index}
            feature={feature}
            onClick={() => setSelectedMarker(feature)}
            isSelected={selectedMarker?.id === feature.id}
          />
        ))}
      </Filter>

      <Slot
        id="controls"
        position="bottom"
        className="p-4 pb-9 flex flex-col gap-2 w-screen pointer-events-none"
      >
        <div className="flex justify-between items-end">
          <ThemeController
            className={cx("pointer-events-auto", {
              "translate-x-96": isSidebarVisible && !isMobile,
              "translate-x-0": !(isSidebarVisible && !isMobile),
            })}
          />
          <div
            ref={viewportControlsRef}
            className={cx("flex items-end gap-2 transition-transform duration-500", {
              "-translate-x-96": shouldBeViewportControlsMoved,
              "translate-x-0": !shouldBeViewportControlsMoved,
            })}
          >
            <PhoneLinksModal className="pointer-events-auto hidden sm:flex" />
            <ViewportController
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
        <Slot id="mobile-header" position="top-right">
          <div className="p-4 flex gap-4">
            <PhoneLinksModal />
            <IconButton
              className="shrink-0"
              onClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
            >
              <Funnel size="md" />
            </IconButton>
          </div>
        </Slot>

        <Slot id="mobile-filter" isVisible={isSidebarVisible} position="top-left">
          <Filters
            isMobile
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            activeFilters={combinedFilter.active}
            onResetFiltersClick={combinedFilter.reset}
            districtFilter={districtFilter}
            layerFilter={layerFilter}
          />
        </Slot>

        <Slot
          id="mobile-detail"
          position="bottom"
          padding={{ bottom: window.innerHeight / 2 - 48 }}
        >
          <Detail
            shouldBeBottomLeftCornerRounded={shouldBeBottomLeftCornerRounded}
            isMobile
            feature={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
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
          <Filters
            isMobile={false}
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            onResetFiltersClick={combinedFilter.reset}
            districtFilter={districtFilter}
            activeFilters={combinedFilter.active}
            layerFilter={layerFilter}
          />
        </Slot>
        <Slot
          isVisible={!!selectedMarker}
          id="desktop-detail"
          position="top-right"
          autoPadding
          avoidMapboxControls={shouldBeViewportControlsMoved}
          persistChildrenWhenClosing
        >
          <Detail
            ref={detailRef}
            shouldBeBottomLeftCornerRounded={shouldBeBottomLeftCornerRounded}
            isMobile={false}
            feature={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
