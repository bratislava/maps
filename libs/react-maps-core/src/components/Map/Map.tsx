import React, {
  ReactNode,
  useEffect,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  createContext,
  useMemo,
  useReducer,
  MouseEvent,
} from "react";
import {
  addTranslations,
  LoadingSpinner,
  Modal,
} from "@bratislava/react-maps-ui";
import { Mapbox, MapboxHandle } from "../Mapbox/Mapbox";
import { useResizeDetector } from "react-resize-detector";
import cx from "classnames";
import { MapActionKind, mapReducer } from "./mapReducer";

import {
  Sources,
  Viewport,
  MapIcon,
  PartialViewport,
  PartialPadding,
} from "../../types";
import { ThemeController } from "../ThemeController/ThemeController";
import { ViewportController } from "../ViewportController/ViewportController";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";
import { i18n } from "i18next";

import enTranslation from "../../translations/en.json";
import skTranslation from "../../translations/sk.json";
import {
  exitFullscreen,
  getFullscreenElement,
  requestFullscreen,
} from "../../utils/fullscreen";
import Mousetrap from "mousetrap";
import { Feature } from "geojson";
import { mergeViewports } from "../Mapbox/viewportReducer";
import { log } from "../../utils/log";
import { Marker } from "../Marker/Marker";
import { getFeatureDistrict } from "../../utils/districts";
import { useTranslation } from "react-i18next";
import { ArrowCounterclockwise } from "@bratislava/react-maps-icons";

export interface IMapProps {
  i18next: i18n;
  mapboxgl: typeof mapboxgl;
  sources?: Sources;
  isDevelopment?: boolean;
  icons?: {
    [index: string]: string | MapIcon;
  };
  mapStyles: {
    light?: string;
    dark?: string;
  };
  isOutsideLoading?: boolean;
  children?: ReactNode;
  layerPrefix?: string;
  moveSearchBarOutsideOfSideBarOnLargeScreen?: boolean;
  initialViewport?: PartialViewport;
  onSelectedFeaturesChange?: (features: Feature[]) => void;
  onMobileChange?: (isMobile: boolean) => void;
  onGeolocationChange?: (isGeolocation: boolean) => void;
  onLegendClick?: (e: MouseEvent) => void;
  loadingSpinnerColor?: string;
}

export type MapHandle = {
  changeViewport: (viewport: PartialViewport) => void;
  fitToDistrict: (district: string | string[]) => void;
  deselectAllFeatures: () => void;
  turnOnGeolocation: () => void;
  turnOffGeolocation: () => void;
  toggleGeolocation: () => void;
};

export interface IMapContext {
  isMobile: boolean | null;
  changeMargin: (margin: PartialPadding) => void;
}

export const mapContext = createContext<IMapContext>({
  isMobile: false,
  changeMargin: () => void 0,
});

export const Map = forwardRef<MapHandle, IMapProps>(
  (
    {
      mapboxgl,
      i18next,
      sources,
      icons,
      mapStyles,
      children,
      layerPrefix = "BRATISLAVA",
      isDevelopment = false,
      initialViewport: inputInitialViewport,
      onSelectedFeaturesChange,
      onMobileChange,
      onGeolocationChange,
      onLegendClick,
      loadingSpinnerColor,
    },
    forwardedRef
  ) => {
    i18next.addResourceBundle("en", "maps", enTranslation);
    i18next.addResourceBundle("sk", "maps", skTranslation);

    // add translations from UI library
    addTranslations(i18next);

    const { t } = useTranslation("maps");

    const mapboxRef = useRef<MapboxHandle>(null);

    const [isDevInfoVisible, setDevInfoVisible] = useState(false);

    const initialViewport = useMemo(
      () =>
        mergeViewports(
          {
            center: {
              lat: 0,
              lng: 0,
            },
            zoom: 0,
            pitch: 0,
            bearing: 0,
            padding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
          inputInitialViewport ?? {}
        ),
      [inputInitialViewport]
    );

    const [mapState, dispatchMapState] = useReducer(mapReducer, {
      isDarkmode: false,
      isSatellite: false,
      isFullscreen: false,
      viewport: initialViewport,
      isGeolocation: false,
      geolocationMarkerLngLat: null,
    });

    const [isMobile, setMobile] = useState<boolean | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [selectedFeatures, setSelectedFeatures] = useState<
      MapboxGeoJSONFeature[]
    >([]);

    const onDarkmodeChange = useCallback((isDarkmode: boolean) => {
      dispatchMapState({ type: MapActionKind.SetDarkmode, value: isDarkmode });
      document.body.classList[isDarkmode ? "add" : "remove"]("dark");
    }, []);

    const onSatelliteChange = useCallback((isSatellite: boolean) => {
      dispatchMapState({
        type: MapActionKind.SetSatellite,
        value: isSatellite,
      });
    }, []);

    const geolocationChangeHandler = useCallback(
      (isGeolocation: boolean) => {
        if (isGeolocation) {
          // if browser supports geolocation
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const geolocationMarkerLngLat = {
                  lng: position.coords.longitude,
                  lat: position.coords.latitude,
                };

                const isInBratislava = !!getFeatureDistrict({
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [
                      geolocationMarkerLngLat.lng,
                      geolocationMarkerLngLat.lat,
                    ],
                  },
                  properties: {},
                });

                if (!isInBratislava) {
                  alert(t("errors.notLocatedInBratislava"));
                  return;
                }

                log("ADDING GEOLOCATION MARKER");
                mapboxRef.current?.changeViewport({
                  center: geolocationMarkerLngLat,
                  zoom: 18,
                });

                dispatchMapState({
                  type: MapActionKind.EnableGeolocation,
                  geolocationMarkerLngLat,
                });
              },
              (error) => {
                alert(`${t("error")}: ${error.message}`);
              }
            );
          } else {
            alert(t("errors.noGeolocationSupport"));
          }
        } else {
          dispatchMapState({
            type: MapActionKind.DisableGeolocation,
          });
        }
      },
      [t]
    );

    const [, setControlsMarginTop] = useState(0);
    const [controlsMarginRight, setControlsMarginRight] = useState(0);
    const [controlsMarginBottom, setControlsMarginBottom] = useState(0);
    const [controlsMarginLeft, setControlsMarginLeft] = useState(0);

    const [isDisplayLandscapeModal, setDisplayLandscapeModal] = useState(false);

    const {
      width: containerWidth,
      height: containerHeight,
      ref: containerRef,
    } = useResizeDetector<HTMLDivElement>();

    // ZOOM IN HANDLER
    const zoomIn = useCallback(() => {
      mapboxRef.current?.changeViewport({
        zoom: mapState.viewport.zoom + 0.5,
      });
    }, [mapState.viewport.zoom]);

    // ZOOM OUT HANDLER
    const zoomOut = useCallback(() => {
      mapboxRef.current?.changeViewport({
        zoom: mapState.viewport.zoom - 0.5,
      });
    }, [mapState.viewport.zoom]);

    const toggleDevInfo = useCallback(() => {
      setDevInfoVisible((isDevInfoVisible) => !isDevInfoVisible);
    }, [setDevInfoVisible]);

    // SHOWING DEVELOPMENT INFO
    useEffect(() => {
      if (isDevelopment) {
        const moustrapBind = Mousetrap.bind(
          ["ctrl+shift+d", "command+shift+d"],
          () => {
            toggleDevInfo();
            return false;
          }
        );
        return () => {
          moustrapBind.unbind(["ctrl+shift+d", "command+shift+d"]);
        };
      }
    }, [isDevelopment, toggleDevInfo]);

    // FULLSCREEN HANDLER
    const toggleFullscreen = useCallback(() => {
      if (containerRef?.current) {
        if (getFullscreenElement()) {
          exitFullscreen();
          dispatchMapState({ type: MapActionKind.SetFullscreen, value: false });
        } else {
          requestFullscreen(containerRef.current);
          dispatchMapState({ type: MapActionKind.SetFullscreen, value: true });
        }
      }
    }, [containerRef]);

    // RESET BEARING HANDLER
    const resetBearing = useCallback(() => {
      mapboxRef.current?.changeViewport({
        bearing: 0,
      });
    }, []);

    // EXPOSING METHODS FOR PARENT COMPONENT
    useImperativeHandle(
      forwardedRef,
      () => ({
        changeViewport(wantedViewport) {
          mapboxRef?.current?.changeViewport(wantedViewport);
        },

        fitToDistrict(district) {
          mapboxRef?.current?.fitToDistrict(district);
        },

        deselectAllFeatures() {
          setSelectedFeatures([]);
        },

        turnOnGeolocation() {
          geolocationChangeHandler(true);
        },

        turnOffGeolocation() {
          geolocationChangeHandler(false);
        },

        toggleGeolocation() {
          geolocationChangeHandler(!mapState.isGeolocation);
        },
      }),
      [geolocationChangeHandler, mapState.isGeolocation]
    );

    const onViewportChange = useCallback((viewport: Viewport) => {
      dispatchMapState({
        type: MapActionKind.ChangeViewport,
        viewport,
      });
    }, []);

    useEffect(() => {
      onSelectedFeaturesChange && onSelectedFeaturesChange(selectedFeatures);
    }, [selectedFeatures, onSelectedFeaturesChange]);

    useEffect(() => {
      if (isMobile !== null && onMobileChange) onMobileChange(isMobile);

      mapboxRef.current?.changeViewport(
        {
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
        true
      );
      setControlsMarginTop(0);
      setControlsMarginRight(0);
      setControlsMarginBottom(0);
      setControlsMarginLeft(0);
    }, [onMobileChange, isMobile]);

    useEffect(() => {
      onGeolocationChange && onGeolocationChange(mapState.isGeolocation);
    }, [onGeolocationChange, mapState.isGeolocation]);

    const onLoad = useCallback(() => {
      setLoading(false);
    }, []);

    const changeMargin = useCallback((margin: PartialPadding) => {
      if (margin.top !== undefined) setControlsMarginTop(margin.top);
      if (margin.right !== undefined) setControlsMarginRight(margin.right);
      if (margin.bottom !== undefined) setControlsMarginBottom(margin.bottom);
      if (margin.left !== undefined) setControlsMarginLeft(margin.left);
    }, []);

    // CALCULATE MAP PADDING ON DETAIL AND FILTERS TOGGLING
    useEffect(() => {
      // move the mapbox logo
      const mapboxLogoElement = document.querySelector(
        ".mapboxgl-ctrl-bottom-left"
      );
      const informationElement = document.querySelector(
        ".mapboxgl-ctrl-bottom-right"
      );
      if (!mapboxLogoElement || !informationElement) return;

      const mapboxLogoMobileStyle = `
        transition: transform 500ms;
        transform: translate(${controlsMarginLeft ?? 0 + 16}px, -${
        controlsMarginBottom + 2
      }px);
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: 4px;
        margin-bottom: 0px;
      `;

      const mapboxLogoDesktopStyle = `
        transition: transform 500ms;
        transform: translate(${controlsMarginLeft ?? 0 + 16}px, -${
        controlsMarginBottom + 2
      }px);
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: 8px;
        margin-bottom: -6px;
      `;

      const informationStyle = `
        transition: transform 500ms;
        transform: translate(-${controlsMarginRight + 16}px);
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      `;

      mapboxLogoElement.setAttribute(
        "style",
        isMobile ? mapboxLogoMobileStyle : mapboxLogoDesktopStyle
      );
      informationElement.setAttribute("style", informationStyle);
    }, [
      controlsMarginBottom,
      controlsMarginLeft,
      controlsMarginRight,
      isMobile,
    ]);

    // SET MOBILE ACCORDING TO CONTAINER WIDTH
    useEffect(() => {
      setMobile((containerWidth ?? 0) < 640);
    }, [containerWidth]);

    const mapContextValue: IMapContext = useMemo(
      () => ({
        isMobile,
        changeMargin,
      }),
      [isMobile, changeMargin]
    );

    // DISPLAY/HIDE WARNING MODAL TO ROTATE DEVICE TO PORTRAIT MODE
    useEffect(() => {
      if (
        (containerWidth ?? 0) < 900 &&
        (containerWidth ?? 0) > (containerHeight ?? 0)
      ) {
        setDisplayLandscapeModal(true);
      } else {
        setDisplayLandscapeModal(false);
      }
    }, [isMobile, containerWidth, containerHeight]);

    return (
      <div className={cx("h-full w-full relative text-foreground-lightmode")}>
        <mapContext.Provider value={mapContextValue}>
          <div
            ref={containerRef}
            className="w-full h-full relative z-10 text-font dark:text-foreground-darkmode"
          >
            <Mapbox
              initialViewport={initialViewport}
              ref={mapboxRef}
              isDarkmode={mapState.isDarkmode}
              isSatellite={mapState.isSatellite}
              layerPrefix={layerPrefix}
              mapStyles={mapStyles}
              mapboxgl={mapboxgl}
              sources={sources ?? {}}
              icons={icons}
              onFeatureClick={setSelectedFeatures}
              onLoad={onLoad}
              selectedFeatures={selectedFeatures}
              onViewportChange={onViewportChange}
              isDevelopment={isDevelopment && isDevInfoVisible}
            >
              <>{children}</>
              {mapState.isGeolocation && mapState.geolocationMarkerLngLat && (
                <Marker
                  lng={mapState.geolocationMarkerLngLat.lng}
                  lat={mapState.geolocationMarkerLngLat.lat}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="opacity-20 flex items-center justify-center">
                      <div className="absolute bg-gray-lightmode dark:bg-gray-darkmode w-20 h-20 rounded-full animate-ping"></div>
                    </div>
                    <div className="absolute w-4 h-4 bg-white dark:bg-black border-4 border-black dark:border-white rounded-full"></div>
                  </div>
                </Marker>
              )}
            </Mapbox>
            <ThemeController
              isDarkmode={mapState.isDarkmode}
              isSatellite={mapState.isSatellite}
              onDarkmodeChange={onDarkmodeChange}
              onSatelliteChange={onSatelliteChange}
              style={{
                transform: `translate(${controlsMarginLeft}px, -${controlsMarginBottom}px)`,
              }}
            />
            <ViewportController
              style={{
                transform: `translate(-${controlsMarginRight}px, -${controlsMarginBottom}px)`,
              }}
              isFullscreen={mapState.isFullscreen}
              viewport={mapState.viewport}
              onZoomInClick={zoomIn}
              onZoomOutClick={zoomOut}
              onFullscreenClick={toggleFullscreen}
              onCompassClick={resetBearing}
              isGeolocation={mapState.isGeolocation}
              onLocationClick={() =>
                geolocationChangeHandler(!mapState.isGeolocation)
              }
              onLegendClick={onLegendClick}
            />
          </div>
        </mapContext.Provider>
        <div
          className={cx(
            "fixed dark:text-foreground-darkmode z-50 top-0 right-0 bottom-0 left-0 bg-background-lightmode dark:bg-background-darkmode flex items-center justify-center text-primary transition-all delay-1000 duration-1000",
            {
              "visible opacity-100": isLoading,
              "invisible opacity-0": !isLoading,
            }
          )}
        >
          <LoadingSpinner
            color={loadingSpinnerColor ?? "#5158D8"}
            size={100}
            thickness={200}
            speed={200}
          />
        </div>

        <Modal
          className="max-w-xs"
          isOpen={isDisplayLandscapeModal}
          closeButtonIcon={
            <ArrowCounterclockwise size="lg" className="text-white" />
          }
        >
          <div className="flex flex-col gap-2 text-center pb-4">
            <div>Na mobilnom zariadení je mapu najlepšie používať na výšku</div>
            <div className="text-[14px]">
              Zanechajte nám spätnú väzbu na adrese{" "}
              <a href="mailto:inovacie@bratislava.sk" className="underline">
                inovacie@bratislava.sk
              </a>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
);

Map.displayName = "Map";

export default Map;
