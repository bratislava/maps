import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles.css";
import { LineString as TurfLineString, lineString } from "@turf/helpers";
import length from "@turf/length";
import cx from "classnames";
import { useWindowSize } from "usehooks-ts";

// maps
import { Slot, MapHandle, Map, ThemeController, ViewportController } from "@bratislava/react-maps";

import { AnimationChangeEvent, Cluster, LineString } from "@bratislava/react-mapbox";

// utils
import { getCvickoIdFromQuery, getIsHomepageFromQuery } from "../utils/utils";
import { processFountainData } from "../utils/fountainUtil";
import { Trans, useTranslation } from "react-i18next";
import { CvickoMarker } from "./CvickoMarker";
import DrinkingFountainMarker from "../components/DrinkingFountainMarker";

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
import type { Feature, Point } from "geojson";
import Detail from "./Detail";
import { RunningTrackButtonMarker } from "./RunningTrackButtonMarker";
import { colors } from "../utils/colors";
import { IconButton } from "@bratislava/react-maps-ui";
import { X } from "@bratislava/react-maps-icons";
import { useQuery } from "../utils/useQuery";
import { useResizeDetector } from "react-resize-detector";
import FountainDetail from "./FountainDetail";

export type TSelectedFeature = Feature<Point> | null;

export const App = () => {
  const mapRef = useRef<MapHandle>(null);

  const { t } = useTranslation();

  const currentCvickoId = useQuery("cvicko", getCvickoIdFromQuery);
  const isHomepage = useQuery("homepage", getIsHomepageFromQuery);

  const [isLoading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<TSelectedFeature>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);

  const [selectedFountain, setSelectedFountain] = useState<TSelectedFeature>(null);
  const { data } = processFountainData();

  const featureClickHandler = (
    feature: TSelectedFeature = null,
    fountain: TSelectedFeature = null) => {
    setSelectedFeature(feature);
    setSelectedFountain(fountain);
    const data = feature || fountain;

    data &&
      mapRef.current?.changeViewport({
        center: {
          lng: data.geometry.coordinates[0],
          lat: data.geometry.coordinates[1],
        },
      });
  }

  // change page title according to current selected cvicko
  useEffect(() => {
    document.title = currentCvickoId
      ? `Cvičko ${t(`cvicko.${currentCvickoId}`)} | ${t("title")}`
      : `Cvičko | ${t("title")}`;
  }, [t, currentCvickoId]);

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
    setSelectedFountain(null);
  }, []);

  // set selected feature based on query
  useEffect(() => {
    const selectedFeature =
      cvickoData.features.find((f) => f.properties?.id === currentCvickoId) ?? null;
    setTimeout(() => {
      setSelectedFeature(selectedFeature);
    }, 4000);
  }, [currentCvickoId]);

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

  // set event listeners
  useEffect(() => {
    const cancelAnimation = (event: KeyboardEvent) => {
      if (event.code === 'Escape') stopAnimation();
    };

    document.addEventListener('keydown', cancelAnimation);

    return () => document.removeEventListener('keydown', cancelAnimation);
  }, [stopAnimation]);

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

  const { height: viewportControlsHeight = 0, ref: viewportControlsRef } = useResizeDetector();
  const { height: detailHeight = 0, ref: detailRef } = useResizeDetector();

  const { height: windowHeight } = useWindowSize();

  const shouldBeViewportControlsMoved = useMemo(() => {
    return windowHeight < viewportControlsHeight + detailHeight + 40 && !!selectedFeature;
  }, [windowHeight, detailHeight, viewportControlsHeight, selectedFeature]);

  return isLoading ? null : (
    <div className="h-full w-full">
      <Map
        interactive={!isAnimating}
        loadingSpinnerColor="#00D4DF"
        ref={mapRef}
        mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
        mapStyles={{
          light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
          dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
        }}
        initialViewport={ininialViewport}
        isDevelopment={import.meta.env.DEV}
        onMobileChange={setMobile}
        maxBounds={maxBounds}
        onMapClick={closeDetail}
        disableBearing
        disablePitch
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
            {
              name: "csob",
              link: "https://www.csob.sk/o-nas/pomahame-a-podporujeme/csob-nadacia",
              image: "logos/csob.png",
              height: 72,
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

        <Cluster features={data?.features ?? []} radius={24}>
          {({ features, lng, lat, key, clusterExpansionZoom }) =>
            features.length === 1 ? (
              <DrinkingFountainMarker
                key={key}
                feature={features[0]}
                isSelected={selectedFountain?.id === features[0].properties?.id}
                onClick={featureClickHandler}
              />
            ) : (
              <DrinkingFountainMarker
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
            onClick={() => featureClickHandler(cvickoFeature)}
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

        <Slot
          id="controls"
          position="bottom"
          className="p-4 pb-9 flex justify-between items-end w-screen pointer-events-none"
        >
          {isAnimating ? (
            <IconButton
              onClick={() => stopAnimation()}
              className="fixed top-4 right-4 w-16 h-16 !rounded-full"
            >
              <X size="lg" />
            </IconButton>
          ) : (
            <>
              <ThemeController className="pointer-events-auto" />
              <div
                ref={viewportControlsRef}
                className={cx("flex items-end gap-2 transition-transform duration-500", {
                  "-translate-x-96": shouldBeViewportControlsMoved,
                  "translate-x-0": !shouldBeViewportControlsMoved,
                })}
              >
                <ViewportController slots={["zoom"]} desktopSlots={[["fullscreen", "zoom"]]} />
              </div>
            </>
          )}
        </Slot>

        <Slot
          id="desktop-detail"
          position="top-right"
          // padding={{ bottom: isMobile ? ((containerHeight ?? 0) / 5) * 3 : 0 }}
          autoPadding={!isMobile}
          avoidMapboxControls={shouldBeViewportControlsMoved ? true : false}
          isVisible={!!selectedFeature || !!selectedFountain}
        >

          {selectedFeature &&
            <Detail
              ref={detailRef}
              currentCvickoId={currentCvickoId}
              onClose={closeDetail}
              isMobile={isMobile ?? false}
              feature={selectedFeature}
            />
          }

          {selectedFountain &&
            <FountainDetail isMobile={isMobile ?? false} feature={selectedFountain} onClose={closeDetail} />
          }

        </Slot>
      </Map>
    </div>
  );
};

export default App;
