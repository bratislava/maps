import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles.css";
import { length, LineString as TurfLineString, lineString } from "@turf/turf";
import cx from "classnames";

// maps
import {
  Slot,
  MapHandle,
  Map,
  ThemeController,
  ViewportController,
  SlotType,
} from "@bratislava/react-maps";

import { AnimationChangeEvent, LineString } from "@bratislava/react-mapbox";

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
import { useResizeDetector } from "react-resize-detector";

export const App = () => {
  const { height: detailHeight, ref: detailRef } = useResizeDetector();

  const { height: containerHeight, ref: containerRef } = useResizeDetector<HTMLDivElement>();

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const { t } = useTranslation();

  const currentCvickoId = useQuery("cvicko", getCvickoIdFromQuery);
  const isHomepage = useQuery("homepage", getIsHomepageFromQuery);

  const [isLoading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);

  // change page title according to current selected cvicko
  useEffect(() => {
    document.title = currentCvickoId
      ? `Cvičko ${t(`cvicko.${currentCvickoId}`)} | ${t("title")}`
      : `Cvičko | ${t("title")}`;
  }, [t, currentCvickoId]);

  // set selected feature based on query
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
        zoom: 16,
      });
    } else {
      setTimeout(() => {
        mapRef.current?.fitFeature(lineString(apolloBasicCoordinates));
      }, 500);
    }
  }, [selectedFeature]);

  const [animatedLineDuration, setAnimatedLineDuration] = useState(0);

  const avoidViewportControls = useMemo(() => {
    return !isMobile && !!selectedFeature && (containerHeight ?? 0) <= (detailHeight ?? 0) + 200;
  }, [containerHeight, isMobile, selectedFeature, detailHeight]);

  const [isAnimating, setAnimating] = useState<boolean>(false);
  const [animatedLineStyles, setAnimatedLineStyles] = useState<any>([]);
  const [animatedLineCoordinates, setAnimatedLineCoordinates] = useState<
    TurfLineString["coordinates"]
  >([]);

  const animateLine = useCallback(
    (line: string) => {
      closeDetail();

      const animatedLineStyles =
        line === "apollo-rt"
          ? apolloDetailedStyles
          : line === "old-bridge-rt"
          ? oldDetailedStyles
          : line === "snp-rt"
          ? snpDetailedStyles
          : line === "small-rt"
          ? smallDetailedStyles
          : line === "large-rt"
          ? largeDetailedStyles
          : [];

      setAnimatedLineStyles(animatedLineStyles);

      const animatedLineCoordinates =
        line === "apollo-rt"
          ? apolloDetailedCoordinates
          : line === "old-bridge-rt"
          ? oldDetailedCoordinates
          : line === "snp-rt"
          ? snpDetailedCoordinates
          : line === "small-rt"
          ? smallDetailedCoordinates
          : line === "large-rt"
          ? largeDetailedCoordinates
          : [
              [0, 0],
              [0, 0],
            ];

      setAnimatedLineCoordinates(animatedLineCoordinates);

      const smallLineLength = length(lineString(smallDetailedCoordinates), { units: "meters" });
      const animatedLineLength = length(lineString(animatedLineCoordinates), { units: "meters" });
      const duration = animatedLineLength / smallLineLength;
      setAnimatedLineDuration(duration * 3);
      setAnimating(true);
    },
    [closeDetail],
  );

  const stopAnimation = useCallback(() => {
    setAnimating(false);
    mapRef.current?.fitFeature(lineString(apolloBasicCoordinates));
  }, []);

  const handleAnimationChange = useCallback((event: AnimationChangeEvent) => {
    mapRef.current?.changeViewport({ center: event.center, pitch: 20, bearing: 25, zoom: 15 }, 200);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);

  const ininialViewport = useMemo(
    () => ({
      center: {
        lat: 48.148598,
        lng: 17.107748,
      },
      zoom: currentCvickoId ? 15 : undefined,
    }),
    [currentCvickoId],
  );

  const maxBounds = useMemo(
    () =>
      [
        [17.04, 48.09],
        [17.16, 48.19],
      ] as [[number, number], [number, number]],
    [],
  );

  const mapStyles = useMemo(
    () => ({
      light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
      dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
    }),
    [],
  );

  return isLoading ? null : (
    <div ref={containerRef} className="h-full w-full">
      <Map
        interactive={!isAnimating}
        loadingSpinnerColor="#00D4DF"
        ref={mapRef}
        mapboxgl={mapboxgl}
        mapStyles={mapStyles}
        initialViewport={ininialViewport}
        isDevelopment={import.meta.env.DEV}
        isOutsideLoading={isLoading}
        onMobileChange={setMobile}
        maxBounds={maxBounds}
        onMapClick={closeDetail}
        disableBearing
        disablePitch
        cooperativeGestures={isMobile ?? false}
      >
        {/* Apollo running track animation button */}
        <RunningTrackButtonMarker
          isVisible={!isAnimating}
          lat={48.13781218517968}
          lng={17.122609073972086}
          onClick={() => animateLine("apollo-rt")}
          color={colors.red}
          length="10 km"
        />

        {/* Old bridge running track animation button */}
        <RunningTrackButtonMarker
          isVisible={!isAnimating}
          lat={48.13829323226889}
          lng={17.110750156057293}
          onClick={() => animateLine("old-bridge-rt")}
          color={colors.violet}
          length="8 km"
        />

        {/* SNP running track animation button */}
        <RunningTrackButtonMarker
          isVisible={!isAnimating}
          lat={48.14075397693506}
          lng={17.079605067162618}
          onClick={() => animateLine("snp-rt")}
          color={colors.orange}
          length="6 km"
        />

        {/* small running track animation button */}
        <RunningTrackButtonMarker
          isSmall
          isVisible={!isAnimating}
          lat={48.1317443849081}
          lng={17.10715026913175}
          onClick={() => animateLine("small-rt")}
          color={colors.blue}
          length="800 m"
        />

        {/* large running track animation button */}
        <RunningTrackButtonMarker
          isSmall
          isVisible={!isAnimating}
          lat={48.13153408900732}
          lng={17.11424132548811}
          onClick={() => animateLine("large-rt")}
          color={colors.brown}
          length="1700 m"
        />

        {/* Cvicko icons */}
        {cvickoData?.features.map((cvickoFeature) => (
          <CvickoMarker
            isHomepage={isHomepage}
            isInQuery={cvickoFeature.properties?.id === currentCvickoId}
            isSelected={cvickoFeature.properties?.id === selectedFeature?.properties?.id}
            key={cvickoFeature.properties?.id}
            feature={cvickoFeature}
            cvickoId={cvickoFeature.properties?.id}
            onClick={() => setSelectedFeature(cvickoFeature)}
          />
        ))}

        {isAnimating ? (
          <LineString
            id="animated-rt"
            coordinates={animatedLineCoordinates}
            onAnimationChange={handleAnimationChange}
            styles={animatedLineStyles}
            duration={animatedLineDuration}
            onAnimationDone={stopAnimation}
          />
        ) : (
          <>
            <LineString
              id="apollo-rt"
              coordinates={apolloBasicCoordinates}
              styles={apolloStyles}
              duration={2}
              initialVisiblePart={1}
            />
            <LineString
              id="old-bridge-rt"
              coordinates={oldBasicCoordinates}
              styles={oldStyles}
              duration={2}
              initialVisiblePart={1}
            />
            <LineString
              id="snp-rt"
              coordinates={snpBasicCoordinates}
              styles={snpStyles}
              duration={2}
              initialVisiblePart={1}
            />
            <LineString
              id="large-rt"
              coordinates={largeBasicCoordinates}
              styles={largeStyles}
              duration={2}
              initialVisiblePart={1}
            />
            <LineString
              id="small-rt"
              coordinates={smallBasicCoordinates}
              styles={smallStyles}
              duration={2}
              initialVisiblePart={1}
            />
          </>
        )}

        <Slot name="controls">
          {isAnimating ? (
            <IconButton
              onClick={() => stopAnimation()}
              className="fixed top-4 right-4 w-16 h-16 rounded-full"
            >
              <X size="lg" />
            </IconButton>
          ) : (
            <>
              <ThemeController className="fixed left-4 bottom-8 sm:transform" />
              <ViewportController
                className={cx("fixed right-4 bottom-8 sm:transform", {
                  "-translate-x-96": avoidViewportControls,
                })}
                slots={viewportControllerSlots}
              />
            </>
          )}
        </Slot>

        <Slot
          openPadding={{
            right: !isMobile ? 384 : 0,
            bottom: isMobile ? ((containerHeight ?? 0) / 5) * 3 : 0,
          }}
          avoidControls={avoidViewportControls ? true : false}
          isVisible={!!selectedFeature}
          name="desktop-detail"
        >
          <Detail
            ref={detailRef}
            currentCvickoId={currentCvickoId}
            onClose={closeDetail}
            isMobile={isMobile ?? false}
            feature={selectedFeature}
          />
        </Slot>
      </Map>
    </div>
  );
};

export default App;
