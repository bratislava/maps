import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import cx from "classnames";
import "../styles.css";

// maps
import {
  DISTRICTS_GEOJSON,
  Slot,
  Layout,
  MapHandle,
  Map,
  Cluster,
  ThemeController,
  ViewportController,
  SlotType,
} from "@bratislava/react-maps-core";

// components
import { Detail } from "./Detail";

// utils
import { processData } from "../utils/utils";
import mapboxgl from "mapbox-gl";
import { Feature, Point, FeatureCollection } from "geojson";

import { Marker } from "./Marker";
import { Modal, Sidebar } from "@bratislava/react-maps-ui";
import { Legend } from "./Legend";
import { useTranslation } from "react-i18next";

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

  return isLoading ? null : (
    <Map
      ref={mapRef}
      mapboxgl={mapboxgl}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={{
        center: {
          lat: 48.16055874931445,
          lng: 17.090805635872925,
        },
        zoom: 11.717870557689393,
      }}
      loadingSpinnerColor="#2BACE2"
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      moveSearchBarOutsideOfSideBarOnLargeScreen
      onMobileChange={setMobile}
      sources={{
        SPORT_GROUNDS_DATA: data,
        DISTRICTS_GEOJSON,
      }}
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
