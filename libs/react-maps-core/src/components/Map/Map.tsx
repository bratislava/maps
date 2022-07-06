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
import { addTranslations, LoadingSpinner } from "@bratislava/react-maps-ui";
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
    satellite?: string;
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
    },
    forwardedRef
  ) => {
    i18next.addResourceBundle("en", "maps", enTranslation);
    i18next.addResourceBundle("sk", "maps", skTranslation);

    // add translations from UI library
    addTranslations(i18next);

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
    });

    const [isMobile, setMobile] = useState<boolean | null>(null);
    const [isGeolocation, setGeolocation] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [selectedFeatures, setSelectedFeatures] = useState<
      MapboxGeoJSONFeature[]
    >([]);

    const onDarkmodeChange = useCallback((isDarkmode: boolean) => {
      dispatchMapState({ type: MapActionKind.SetDarkmode, value: isDarkmode });
    }, []);

    const onSatelliteChange = useCallback((isSatellite: boolean) => {
      dispatchMapState({
        type: MapActionKind.SetSatellite,
        value: isSatellite,
      });
    }, []);

    const [, setControlsMarginTop] = useState(0);
    const [controlsMarginRight, setControlsMarginRight] = useState(0);
    const [controlsMarginBottom, setControlsMarginBottom] = useState(0);
    const [controlsMarginLeft, setControlsMarginLeft] = useState(0);

    const { width: containerWidth, ref: containerRef } =
      useResizeDetector<HTMLDivElement>();

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
          setGeolocation(true);
        },

        turnOffGeolocation() {
          setGeolocation(false);
        },

        toggleGeolocation() {
          setGeolocation((g) => !g);
        },
      }),
      [setGeolocation, setSelectedFeatures]
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
      // setControlsMarginTop(0);
      // setControlsMarginRight(0);
      // setControlsMarginBottom(0);
      // setControlsMarginLeft(0);
    }, [onMobileChange, isMobile]);

    useEffect(() => {
      onGeolocationChange && onGeolocationChange(isGeolocation);
    }, [onGeolocationChange, isGeolocation]);

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

    return (
      <>
        <mapContext.Provider value={mapContextValue}>
          <div
            ref={containerRef}
            className="w-full h-full relative z-10 text-font"
          >
            <Mapbox
              initialViewport={initialViewport}
              ref={mapboxRef}
              isDarkmode={mapState.isDarkmode}
              isSatellite={mapState.isSatellite}
              isGeolocation={isGeolocation}
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
              {children}
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
              isGeolocation={isGeolocation}
              onLocationClick={() => setGeolocation(!isGeolocation)}
              onLegendClick={onLegendClick}
            />
          </div>
        </mapContext.Provider>
        <div
          className={cx(
            "fixed z-50 top-0 right-0 bottom-0 left-0 bg-background flex items-center justify-center text-primary transition-all delay-1000 duration-1000",
            {
              "visible opacity-100": isLoading,
              "invisible opacity-0": !isLoading,
            }
          )}
        >
          <LoadingSpinner
            color="#5158D8"
            size={100}
            thickness={200}
            speed={200}
          />
        </div>
      </>
    );
  }
);

Map.displayName = "Map";

export default Map;
