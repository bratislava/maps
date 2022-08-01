import { useEffect, useMemo, useRef, useState } from "react";
import cx from "classnames";
import "../styles.css";
import { useMotionValue } from "framer-motion";
import { lineString } from "@turf/turf";

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

import { Layer, Marker, LineString, useFilter } from "@bratislava/react-mapbox";

// layer styles
import apolloStyles from "../assets/layers/apollo/apollo-styles";
import oldBridgeStyles from "../assets/layers/old-bridge/old-bridge-styles";
import snpStyles from "../assets/layers/snp/snp-styles";

// utils
import mapboxgl from "mapbox-gl";
import { getCvickoIdFromQuery } from "../utils/utils";
import { useTranslation } from "react-i18next";
import { CvickoMarker } from "./CvickoMarker";

import { apolloRunningTrackCoordinates } from "../assets/layers/apollo/apollo-running-track-coordinates";
import { cvickoData } from "../assets/layers/cvicko/cvicko-data";
import { oldBridgeRunningTrackCoordinates } from "../assets/layers/old-bridge/old-bridge-running-track-coordinates";
import { snpRunningTrackCoordinates } from "../assets/layers/snp/snp-running-track-coordinates";

const currentCvickoId = getCvickoIdFromQuery();

export const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t(`cvicko.${currentCvickoId}`)} | ${t("title")}`;
  }, [t]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const [runningTrackVisiblePart, setRunningTrackVisiblePart] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setRunningTrackVisiblePart(1);
    }, 6000);
  }, [runningTrackVisiblePart]);

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const [isMobile, setMobile] = useState<boolean | null>(null);

  // fit to largest running track after load
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        mapRef.current?.fitFeature(lineString(apolloRunningTrackCoordinates));
      }, 3000);
    }
  }, [isLoading]);

  // const runningTracksFilter = useFilter({
  //   property: "id",
  //   keys: useMemo(() => ["most-snp", "stary-most", "apollo"], []),
  // });

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile ? ["zoom"] : [["fullscreen", "zoom"]];
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
      onMobileChange={setMobile}
    >
      {/* Cvicko icons */}
      {cvickoData?.features.map((cvickoFeature) => (
        <CvickoMarker
          key={cvickoFeature.properties?.id}
          feature={cvickoFeature}
          currentCvickoId={currentCvickoId}
          cvickoId={cvickoFeature.properties?.id}
        />
      ))}

      {/* Apollo running track */}
      <LineString
        id="apollo-running-track"
        coordinates={apolloRunningTrackCoordinates}
        styles={apolloStyles}
        visiblePart={runningTrackVisiblePart}
        duration={5000}
      />
      {/* Old bridge running track */}
      <LineString
        id="old-bridge-running-track"
        coordinates={oldBridgeRunningTrackCoordinates}
        styles={oldBridgeStyles}
        visiblePart={runningTrackVisiblePart}
        duration={4000}
      />
      {/* SNP running track */}
      <LineString
        id="snp-running-track"
        coordinates={snpRunningTrackCoordinates}
        styles={snpStyles}
        visiblePart={runningTrackVisiblePart}
        duration={3000}
      />

      {/* Running track play buttons */}

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
