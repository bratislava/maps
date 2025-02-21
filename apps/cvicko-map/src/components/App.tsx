import { lineString, LineString as TurfLineString } from "@turf/helpers";
import length from "@turf/length";
import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import "../styles.css";

// maps
import { Map, MapHandle, Slot, ThemeController, ViewportController } from "@bratislava/react-maps";

import { AnimationChangeEvent, Cluster, LineString } from "@bratislava/react-mapbox";

// utils
import { Trans, useTranslation } from "react-i18next";
import DrinkingFountainMarker from "../components/DrinkingFountainMarker";
import { processFountainData } from "../utils/fountainUtil";
import {
  generateRawWorkoutData,
  getCvickoIdFromQuery,
  getIsHomepageFromQuery,
  IWorkout,
} from "../utils/utils";
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

import { X } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";
import type { Feature, Point } from "geojson";
import { useResizeDetector } from "react-resize-detector";
import { colors } from "../utils/colors";
import { useQuery } from "../utils/useQuery";
import { RunningTrackButtonMarker } from "./RunningTrackButtonMarker";
import Detail from "./Detail";
import { FeatureCollection } from "@bratislava/utils/src/types";

import { runningTracks } from "../assets/layers/running-tracks/data/running-tacks";

export type TSelectedFeature = Feature<Point> | null;

const queryWorkouts =
  "https://general-strapi.bratislava.sk/api/cvickas?populate=*&pagination[limit]=-1";

export const App = () => {
  const mapRef = useRef<MapHandle>(null);

  const { t } = useTranslation();

  const [cvickoData, setCvickoData] = useState<FeatureCollection<Point> | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<TSelectedFeature>(null);

  const currentCvickoId = useQuery("cvicko", getCvickoIdFromQuery);
  const isHomepage = useQuery("homepage", getIsHomepageFromQuery);

  const [isMobile, setMobile] = useState<boolean | null>(null);

  const [selectedFountain, setSelectedFountain] = useState<TSelectedFeature>(null);
  const { data } = processFountainData();

  const [rawDataCvicko, setRawDataCvicko] = useState<Array<IWorkout>>();

  const [isDetailOpened, setIsDetailOpened] = useState(false);

  useEffect(() => {
    setIsDetailOpened(selectedFeature !== null || selectedFountain !== null);
  }, [selectedFeature, selectedFountain]);

  useEffect(() => {
    fetch(queryWorkouts, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => JSON.stringify(setRawDataCvicko(response.data)));
  }, []);

  useEffect(() => {
    if (rawDataCvicko) {
      const data = generateRawWorkoutData(rawDataCvicko);

      setCvickoData(data);
    }
  }, [rawDataCvicko]);

  const featureClickHandler = (
    feature: TSelectedFeature = null,
    fountain: TSelectedFeature = null,
  ) => {
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
  };

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

  const handleAnimationChange = (event: AnimationChangeEvent) => {
    mapRef.current?.changeViewport({ center: event.center, pitch: 20, bearing: 25, zoom: 15 }, 200);
  };

  // set event listeners
  useEffect(() => {
    const cancelAnimation = (event: KeyboardEvent) => {
      if (event.code === "Escape") stopAnimation();
    };

    document.addEventListener("keydown", cancelAnimation);

    return () => document.removeEventListener("keydown", cancelAnimation);
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

  return (
    <div className="h-full w-full">
      <Map
        interactive={!isAnimating}
        minZoom={!isMobile ? 13 : 13.3}
        loadingSpinnerColor={colors.cyan}
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
        disablePitch={false}
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

        {runningTracks.map((track) => {
          return (
            <>
              <RunningTrackButtonMarker
                isVisible={!isAnimating}
                lat={track.lat}
                lng={track.lng}
                onClick={() => animateLine("apollo-rt")}
                color={track.color}
                length={track.length}
              />
            </>
          );
        })}

        {/* Cvicko icons */}
        {cvickoData?.features.map((cvickoFeature) => (
          <CvickoMarker
            isHomepage={isHomepage}
            isInQuery={cvickoFeature.properties?.id === currentCvickoId}
            isSelected={cvickoFeature.properties?.id === selectedFeature?.properties?.id}
            key={cvickoFeature.properties?.id}
            feature={cvickoFeature}
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
          position={isAnimating ? "top" : "bottom"}
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

        <Slot id="mobile-detail" isVisible={isDetailOpened && isMobile !== null && isMobile}>
          <Detail
            isMobile={isMobile !== null && isMobile}
            feature={selectedFeature}
            fountain={selectedFountain}
            onClose={closeDetail}
          />
        </Slot>

        <Slot
          id="desktop-detail"
          position="top-right"
          // padding={{ bottom: isMobile ? ((containerHeight ?? 0) / 5) * 3 : 0 }}
          autoPadding={!isMobile}
          avoidMapboxControls={shouldBeViewportControlsMoved ? true : false}
          isVisible={!!selectedFeature || !!selectedFountain}
        >
          <Slot
            id="desktop-detail"
            isVisible={isDetailOpened && !isMobile}
            position="top-right"
            autoPadding
          >
            <div
              ref={detailRef}
              className={cx("w-96", {
                "shadow-lg": isDetailOpened,
              })}
            >
              <Detail
                isMobile={false}
                feature={selectedFeature}
                fountain={selectedFountain}
                onClose={closeDetail}
              />
            </div>
          </Slot>
        </Slot>
      </Map>
    </div>
  );
};

export default App;
