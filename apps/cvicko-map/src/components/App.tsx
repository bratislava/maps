import { useEffect, useMemo, useRef, useState } from "react";
import cx from "classnames";
import "../styles.css";

// maps
import {
  Slot,
  Layout,
  MapHandle,
  Map,
  ThemeController,
  ViewportController,
  SlotType,
} from "@bratislava/react-maps";

import { Layer, useFilter } from "@bratislava/react-mapbox";

// layer styles
import apolloStyles from "../assets/layers/apollo/apollo-styles";
import oldBridgeStyles from "../assets/layers/old-bridge/old-bridge-styles";
import snpStyles from "../assets/layers/snp/snp-styles";

// utils
import mapboxgl from "mapbox-gl";
import { FeatureCollection } from "geojson";
import { getCvickoIdFromQuery, getProcessedData } from "../utils/utils";
import { useTranslation } from "react-i18next";

const currentCvickoId = getCvickoIdFromQuery();

export const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t(`cvicko.${currentCvickoId}`)} | ${t("title")}`;
  }, [t]);

  const [isLoading, setLoading] = useState(true);
  const [apolloData, setApolloData] = useState<FeatureCollection | null>(null);
  const [oldBridgeData, setOldBridgeData] = useState<FeatureCollection | null>(null);
  const [snpData, setSnpData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    const { apolloData, oldBridgeData, snpData } = getProcessedData();

    setApolloData(apolloData);
    setOldBridgeData(oldBridgeData);
    setSnpData(snpData);
    setLoading(false);
  }, []);

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const [isMobile, setMobile] = useState<boolean | null>(null);

  // fit to largest running track after load
  useEffect(() => {
    if (!isLoading && apolloData?.features[0]) {
      setTimeout(() => {
        mapRef.current?.fitFeature(apolloData?.features[0]);
      }, 3000);
    }
  }, [apolloData?.features, isLoading]);

  // const runningTracksFilter = useFilter({
  //   property: "id",
  //   keys: useMemo(() => ["most-snp", "stary-most", "apollo"], []),
  // });

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile ? ["compass", "zoom"] : ["compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#00D4DF"
      ref={mapRef}
      mapboxgl={mapboxgl}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={{
        center: {
          lat: 48.148598,
          lng: 17.107748,
        },
      }}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      sources={{
        apollo: apolloData,
        oldBridge: oldBridgeData,
        snp: snpData,
      }}
      onMobileChange={setMobile}
    >
      <Layer source="apollo" styles={apolloStyles} />
      <Layer source="oldBridge" styles={oldBridgeStyles} />
      <Layer source="snp" styles={snpStyles} />

      <Slot name="controls">
        <ThemeController className="fixed left-4 bottom-[88px] sm:bottom-8 sm:transform" />
        <ViewportController
          className="fixed right-4 bottom-[88px] sm:bottom-8 sm:transform"
          slots={viewportControllerSlots}
        />
      </Slot>

      <Layout isOnlyMobile></Layout>

      <Layout isOnlyDesktop></Layout>
    </Map>
  );
};

export default App;
