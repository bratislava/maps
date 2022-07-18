import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
} from "@bratislava/react-maps-core";

// components
import { Detail } from "./Detail";

// utils
import i18next from "../utils/i18n";
import { processData } from "../utils/utils";
import mapboxgl from "mapbox-gl";
import { Feature, Point, FeatureCollection } from "geojson";

import { Marker } from "./Marker";

export const App = () => {
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);

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

  return isLoading ? null : (
    <Map
      ref={mapRef}
      mapboxgl={mapboxgl}
      i18next={i18next}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={{
        center: {
          lat: 48.142555534347395,
          lng: 17.108218965811034,
        },
        zoom: 14,
      }}
      loadingSpinnerColor="#2BACE2"
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      moveSearchBarOutsideOfSideBarOnLargeScreen
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

      <Layout isOnlyMobile>
        <Slot openPadding={{ bottom: 88 }} name="mobile-detail" isVisible={isDetailOpen ?? false}>
          <Detail isMobile feature={selectedFeature} onClose={closeDetail} />
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
      </Layout>
    </Map>
  );
};

export default App;
