import cx from "classnames";
import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles.css";

// maps
import { Cluster } from "@bratislava/react-mapbox";
import {
  Layout,
  Map,
  MapHandle,
  Slot,
  SlotType,
  ThemeController,
  ViewportController,
} from "@bratislava/react-maps";

// components
import { Detail } from "./Detail";

// utils
import { Feature, FeatureCollection, Point } from "geojson";
import mapboxgl from "mapbox-gl";
import { processData } from "../utils/utils";

import { Modal, Sidebar } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { ReactComponent as BALogo } from "../assets/ba-logo.svg";
import { Legend } from "./Legend";
import { Marker } from "./Marker";

export const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("title");
  }, [t]);

  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [isLegendVisible, setLegendVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const { data } = processData();
    setData(data);
    setLoading(false);
  }, []);

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const isDetailOpen = useMemo(() => !!selectedFeature, [selectedFeature]);

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  const markerClickHandler = useCallback((feature: Feature<Point>) => {
    setSelectedFeature(feature);
    mapRef.current?.changeViewport({
      center: {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      },
    });
  }, []);

  const onLegendClick = useCallback((e: MouseEvent) => {
    setLegendVisible((isLegendVisible) => !isLegendVisible);
    e.stopPropagation();
  }, []);

  const [isMobile, setMobile] = useState<boolean | null>(null);

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile
      ? ["legend", "compass", ["geolocation", "zoom"]]
      : ["legend", "geolocation", "compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

  const mapStyles = useMemo(
    () => ({
      light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
      dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
    }),
    [],
  );

  const initialViewport = useMemo(
    () => ({
      center: {
        lat: 48.16055874931445,
        lng: 17.090805635872925,
      },
      zoom: 11.717870557689393,
    }),
    [],
  );

  return isLoading ? null : (
    <Map
      ref={mapRef}
      mapboxgl={mapboxgl}
      mapStyles={mapStyles}
      initialViewport={initialViewport}
      loadingSpinnerColor="#2BACE2"
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      onMobileChange={setMobile}
      onMapClick={closeDetail}
    >
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
            <Marker
              key={key}
              feature={{
                ...features[0],
                geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
              }}
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

      <Slot name="header">
        <div className="fixed border-2 border-background-lightmode dark:border-gray-darkmode/20 left-4 right-4 top-4 sm:right-auto bg-background-lightmode dark:bg-background-darkmode shadow-lg rounded-lg p-4 flex gap-4">
          <span className="text-primary">
            <BALogo />
          </span>
          <span className="font-semibold">{t("title")}</span>
        </div>
      </Slot>

      <Slot name="controls">
        <ThemeController
          className={cx("fixed left-4 bottom-8 transform sm:transform-none", {
            "-translate-y-[92px]": isDetailOpen,
          })}
        />
        <ViewportController
          className={cx("fixed right-4 bottom-8 transform sm:transform-none", {
            "-translate-y-[92px]": isDetailOpen,
          })}
          onLegendClick={onLegendClick}
          slots={viewportControllerSlots}
        />
      </Slot>

      <Layout isOnlyMobile>
        <Slot openPadding={{ bottom: 88 }} name="mobile-detail" isVisible={isDetailOpen ?? false}>
          <Detail isMobile feature={selectedFeature} onClose={closeDetail} />
        </Slot>
        <Slot
          name="mobile-legend"
          isVisible={isLegendVisible}
          setVisible={setLegendVisible}
          avoidControls={false}
        >
          <Sidebar
            title={t("legend.backToMap")}
            isVisible={isLegendVisible}
            setVisible={setLegendVisible}
            position="right"
          >
            <Legend />
          </Sidebar>
        </Slot>
      </Layout>
      <Layout isOnlyDesktop>
        <Slot name="desktop-detail" isVisible={isDetailOpen}>
          <div
            className={cx("fixed top-0 right-0 w-96 bg-background transition-all duration-500", {
              "translate-x-full": !isDetailOpen,
              "shadow-lg": isDetailOpen,
            })}
          >
            <Detail isMobile={false} feature={selectedFeature} onClose={closeDetail} />
          </div>
        </Slot>
        <Slot name="desktop-legend">
          <Modal
            closeButtonInCorner
            title={t("legend.title")}
            isOpen={isLegendVisible ?? false}
            onClose={() => setLegendVisible(false)}
          >
            <Legend />
          </Modal>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
