import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles.css";
import { lineString, Position } from "@turf/turf";

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

import { LineString } from "@bratislava/react-mapbox";

// utils
import mapboxgl from "mapbox-gl";
import { getCvickoIdFromQuery, getIsHomepageFromQuery } from "../utils/utils";
import { useTranslation } from "react-i18next";
import { CvickoMarker } from "./CvickoMarker";

import { coordinates as apolloBasicCoordinates } from "../assets/layers/running-tracks/basic/apollo";
import { coordinates as largeBasicCoordinates } from "../assets/layers/running-tracks/basic/large";
import { coordinates as oldBasicCoordinates } from "../assets/layers/running-tracks/basic/old";
import { coordinates as smallBasicCoordinates } from "../assets/layers/running-tracks/basic/small";
import { coordinates as snpBasicCoordinates } from "../assets/layers/running-tracks/basic/snp";

import { coordinates as apolloDetailedCoordinates } from "../assets/layers/running-tracks/detailed/apollo";
import { coordinates as largeDetailedCoordinates } from "../assets/layers/running-tracks/detailed/large";
import { coordinates as oldDetailedCoordinates } from "../assets/layers/running-tracks/detailed/old";
import { coordinates as smallDetailedCoordinates } from "../assets/layers/running-tracks/detailed/small";
import { coordinates as snpDetailedCoordinates } from "../assets/layers/running-tracks/detailed/snp";

import apolloStyles from "../assets/layers/running-tracks/basic/apollo-styles";
import largeStyles from "../assets/layers/running-tracks/basic/large-styles";
import oldStyles from "../assets/layers/running-tracks/basic/old-styles";
import smallStyles from "../assets/layers/running-tracks/basic/small-styles";
import snpStyles from "../assets/layers/running-tracks/basic/snp-styles";

import apolloDetailedStyles from "../assets/layers/running-tracks/detailed/apollo-styles";
import largeDetailedStyles from "../assets/layers/running-tracks/detailed/large-styles";
import oldDetailedStyles from "../assets/layers/running-tracks/detailed/old-styles";
import smallDetailedStyles from "../assets/layers/running-tracks/detailed/small-styles";
import snpDetailedStyles from "../assets/layers/running-tracks/detailed/snp-styles";

import { cvickoData } from "../assets/layers/cvicko/cvicko-data";
import { Feature, Point } from "geojson";
import Detail from "./Detail";
import { RunningTrackButtonMarker } from "./RunningTrackButtonMarker";
import { colors } from "../utils/colors";
import { IconButton } from "@bratislava/react-maps-ui";
import { X } from "@bratislava/react-maps-icons";
import { useQuery } from "../utils/useQuery";

export const App = () => {
  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const { t } = useTranslation();

  const currentCvickoId = useQuery("cvicko", getCvickoIdFromQuery);
  const isHomepage = useQuery("homepage", getIsHomepageFromQuery);

  const [isLoading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);
  const [animatedLine, setAnimatedLine] = useState<string | null>(null);

  // change page title according to current selected cvicko
  useEffect(() => {
    document.title = currentCvickoId
      ? `Cvičko ${t(`cvicko.${currentCvickoId}`)} | ${t("title")}`
      : `Cvičko | ${t("title")}`;
  }, [t, currentCvickoId]);

  // set selected feature based o query
  useEffect(() => {
    setSelectedFeature(
      cvickoData.features.find((f) => f.properties?.id === currentCvickoId) ?? null,
    );
  }, [currentCvickoId]);

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile ? ["zoom"] : [["fullscreen", "zoom"]];
  }, [isMobile]);

  useEffect(() => {
    if (selectedFeature) {
      mapRef.current?.changeViewport({
        center: {
          lng: selectedFeature.geometry.coordinates[0],
          lat: selectedFeature.geometry.coordinates[1],
        },
      });
    }
  }, [selectedFeature]);

  const animatedLineCoordinates: Position[] = useMemo(() => {
    return animatedLine === "apollo-rt"
      ? apolloDetailedCoordinates
      : animatedLine === "old-bridge-rt"
      ? oldDetailedCoordinates
      : animatedLine === "snp-rt"
      ? snpDetailedCoordinates
      : animatedLine === "small-rt"
      ? smallDetailedCoordinates
      : animatedLine === "large-rt"
      ? largeDetailedCoordinates
      : [
          [0, 0],
          [0, 0],
        ];
  }, [animatedLine]);

  const animatedLineStyle: any[] = useMemo(() => {
    return animatedLine === "apollo-rt"
      ? apolloDetailedStyles
      : animatedLine === "old-bridge-rt"
      ? oldDetailedStyles
      : animatedLine === "snp-rt"
      ? snpDetailedStyles
      : animatedLine === "small-rt"
      ? smallDetailedStyles
      : animatedLine === "large-rt"
      ? largeDetailedStyles
      : [];
  }, [animatedLine]);

  const [animatedLineVisiblePart, setAnimatedLineVisiblePart] = useState(0);
  const [animatedLineDuration, setAnimatedLineDuration] = useState(0);

  useEffect(() => {
    setAnimatedLineDuration(0);
    setAnimatedLineVisiblePart(0);
    setTimeout(() => {
      setAnimatedLineDuration(5000);
      setAnimatedLineVisiblePart(1);
    }, 100);
  }, [animatedLine]);

  useEffect(() => {
    if (!isLoading && !currentCvickoId) {
      console.log("hello");
      mapRef.current?.fitFeature(lineString(apolloBasicCoordinates));
    }
  }, [isLoading, currentCvickoId]);

  useEffect(() => {
    if (animatedLine) {
      closeDetail();
    }
  }, [animatedLine, closeDetail]);

  useEffect(() => {
    setLoading(false);
  }, []);

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
        zoom: currentCvickoId ? 15 : undefined,
      }}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      onMobileChange={setMobile}
      maxBounds={[
        [17.04, 48.09],
        [17.16, 48.19],
      ]}
      onMapClick={(e) => console.log(e)}
      disableBearing
      disablePitch
    >
      {/* Apollo running track animation button */}
      <RunningTrackButtonMarker
        isVisible={animatedLine === null || animatedLine === "apollo-rt"}
        lat={48.13781218517968}
        lng={17.122609073972086}
        onClick={() => setAnimatedLine("apollo-rt")}
        color={colors.red}
        length="10 km"
      />

      {/* Old bridge running track animation button */}
      <RunningTrackButtonMarker
        isVisible={animatedLine === null || animatedLine === "old-bridge-rt"}
        lat={48.13829323226889}
        lng={17.110750156057293}
        onClick={() => setAnimatedLine("old-bridge-rt")}
        color={colors.violet}
        length="8 km"
      />

      {/* SNP running track animation button */}
      <RunningTrackButtonMarker
        isVisible={animatedLine === null || animatedLine === "snp-rt"}
        lat={48.14075397693506}
        lng={17.079605067162618}
        onClick={() => setAnimatedLine("snp-rt")}
        color={colors.orange}
        length="6 km"
      />

      {/* small running track animation button */}
      <RunningTrackButtonMarker
        isSmall
        isVisible={animatedLine === null || animatedLine === "small-rt"}
        lat={48.1317443849081}
        lng={17.10715026913175}
        onClick={() => setAnimatedLine("small-rt")}
        color={colors.blue}
        length="800 m"
      />

      {/* large running track animation button */}
      <RunningTrackButtonMarker
        isSmall
        isVisible={animatedLine === null || animatedLine === "large-rt"}
        lat={48.13153408900732}
        lng={17.11424132548811}
        onClick={() => setAnimatedLine("large-rt")}
        color={colors.brown}
        length="1700 m"
      />

      {/* Cvicko icons */}
      {cvickoData?.features.map((cvickoFeature) => (
        <CvickoMarker
          isHomepage={isHomepage}
          isSelected={cvickoFeature.properties?.id === selectedFeature?.properties?.id}
          key={cvickoFeature.properties?.id}
          feature={cvickoFeature}
          cvickoId={cvickoFeature.properties?.id}
          onClick={() => setSelectedFeature(cvickoFeature)}
        />
      ))}

      {/* Animated track */}
      {animatedLine ? (
        <LineString
          id="animated-rt"
          coordinates={animatedLineCoordinates}
          styles={animatedLineStyle}
          visiblePart={animatedLineVisiblePart}
          duration={animatedLineDuration}
          onAnimationDone={() => setAnimatedLine(null)}
        />
      ) : (
        <>
          {/* Apollo running track */}
          <LineString
            id="apollo-rt"
            coordinates={apolloBasicCoordinates}
            styles={apolloStyles}
            duration={2000}
          />
          {/* Old bridge running track */}
          <LineString
            id="old-bridge-rt"
            coordinates={oldBasicCoordinates}
            styles={oldStyles}
            duration={2000}
          />
          {/* SNP running track */}
          <LineString
            id="snp-rt"
            coordinates={snpBasicCoordinates}
            styles={snpStyles}
            duration={2000}
          />
          {/* large running track */}
          <LineString
            id="large-rt"
            coordinates={largeBasicCoordinates}
            styles={largeStyles}
            duration={2000}
          />
          {/* small running track */}
          <LineString
            id="small-rt"
            coordinates={smallBasicCoordinates}
            styles={smallStyles}
            duration={2000}
          />
        </>
      )}

      <Slot name="controls">
        {!animatedLine && (
          <>
            <ThemeController className="fixed left-4 bottom-8 sm:transform" />
            <ViewportController
              className="fixed right-4 bottom-8 sm:transform"
              slots={viewportControllerSlots}
            />
          </>
        )}
        {animatedLine && (
          <IconButton
            onClick={() => setAnimatedLine(null)}
            className="fixed top-4 right-4 w-16 h-16 rounded-full"
          >
            <X size="lg" />
          </IconButton>
        )}
      </Slot>

      <Layout isOnlyMobile>
        <Slot
          openPadding={{ bottom: (window.innerHeight / 5) * 3 }}
          isVisible={!!selectedFeature}
          avoidControls={false}
          name="desktop-detail"
        >
          <Detail onClose={closeDetail} isMobile={true} feature={selectedFeature} />
        </Slot>
      </Layout>

      <Layout isOnlyDesktop>
        <Slot
          openPadding={{ right: 384 }}
          avoidControls={false}
          isVisible={!!selectedFeature}
          name="desktop-detail"
        >
          <Detail onClose={closeDetail} isMobile={false} feature={selectedFeature} />
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
