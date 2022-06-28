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
} from "react";
import { LoadingSpinner } from "@bratislava/mapbox-maps-ui";
import { Mapbox, MapboxHandle } from "../Mapbox";
import { useResizeDetector } from "react-resize-detector";
import cx from "classnames";
import DATA_DISTRICTS from "../../assets/layers/districts.json";

import { Sources, IViewport, MapIcon, ILngLat, IPadding } from "../../types";
import { ThemeController } from "../ThemeController";
import { ViewportController } from "../ViewportController";
import mapboxgl from "mapbox-gl";
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

export interface KeyStateRecord<T> {
  key: string;
  state: T;
}

export const getKeyStateValue = <T,>(
  state: KeyStateRecord<T>[],
  key: string
) => {
  const foundState = state.find((item) => item.key == key);
  return foundState ? foundState.state : undefined;
};

export const toggleKeyStateValue = (
  state: KeyStateRecord<boolean>[],
  key: string
) => {
  const foundState = state.find((item) => item.key == key);
  if (foundState) {
    foundState.state = !foundState.state;
  }
  return [...state];
};

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
  defaultCenter?: ILngLat;
  onSelectedFeaturesChange?: (features: Feature[]) => void;
  onMobileChange?: (isMobile: boolean) => void;
}

export type MapHandle = {
  changeViewport: (viewport: Partial<IViewport>) => void;
  fitToDistrict: (district: string | null) => void;
  deselectAllFeatures: () => void;
  turnOnGeolocation: () => void;
  turnOffGeolocation: () => void;
  toggleGeolocation: () => void;
};

export interface IMapContext {
  isMobile: boolean;
}

export const mapContext = createContext<IMapContext>({
  isMobile: false,
});

export const Map = forwardRef<MapHandle, IMapProps>(
  (
    {
      mapboxgl,
      i18next,
      sources = {},
      icons = {},
      mapStyles,
      children,
      layerPrefix = "BRATISLAVA",
      isDevelopment = false,
      defaultCenter = {
        lat: 17.107748,
        lng: 48.148598,
      },
      onSelectedFeaturesChange = () => void 0,
      onMobileChange = () => void 0,
    },
    forwardedRef
  ) => {
    i18next.addResources("en", "maps", enTranslation);
    i18next.addResources("sk", "maps", skTranslation);

    const mapboxRef = useRef<MapboxHandle>(null);

    const [isDevInfoVisible, setDevInfoVisible] = useState(false);

    const [isMobile, setMobile] = useState(true);
    const [isGeolocation, setGeolocation] = useState(false);
    const [isDarkmode, setDarkmode] = useState(false);
    const [isFullscreen, setFullscreen] = useState(false);
    const [isSatellite, setSatellite] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);

    const extendedSources = {
      ...sources,
      DATA_DISTRICTS,
    };

    const [bearing, setBearing] = useState(0);
    const [padding, setPadding] = useState<IPadding>({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    const [controlsMargin, setControlsMargin] = useState<IPadding>({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    const { width: containerWidth, ref: containerRef } =
      useResizeDetector<HTMLDivElement>();

    //ZOOM IN HANDLER
    const zoomIn = useCallback(() => {
      const mapbox = mapboxRef.current;
      if (mapbox) {
        mapbox.changeViewport({
          zoom: mapbox.viewport.zoom ? mapbox.viewport.zoom + 0.5 : 13,
        });
      }
    }, [mapboxRef]);

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
    }, [isDevelopment]);

    //ZOOM OUT HANDLER
    const zoomOut = useCallback(() => {
      const mapbox = mapboxRef.current;
      if (mapbox) {
        mapbox.changeViewport({
          zoom: mapbox.viewport.zoom ? mapbox.viewport.zoom - 0.5 : 13,
        });
      }
    }, [mapboxRef]);

    //FULLSCREEN HANDLER
    const toggleFullscreen = useCallback(() => {
      if (containerRef?.current) {
        if (getFullscreenElement()) {
          exitFullscreen();
          setFullscreen(false);
        } else {
          requestFullscreen(containerRef.current);
          setFullscreen(true);
        }
      }
    }, [containerRef]);

    //RESET BEARING HANDLER
    const resetBearing = useCallback(() => {
      const mapbox = mapboxRef.current;
      if (mapbox) {
        mapbox.changeViewport({
          bearing: 0,
        });
      }
    }, [mapboxRef]);

    //EXPOSING METHODS FOR PARENT COMPONENT
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
      [
        forwardedRef,
        mapboxRef,
        isMobile,
        setGeolocation,
        selectedFeatures,
        setSelectedFeatures,
      ]
    );

    useEffect(() => {
      onSelectedFeaturesChange(selectedFeatures);
    }, [selectedFeatures, onSelectedFeaturesChange]);

    useEffect(() => {
      onMobileChange(isMobile);
    }, [onMobileChange, isMobile]);

    const onViewportChange = useCallback((viewport: IViewport) => {
      setBearing(viewport.bearing);
    }, []);

    const onViewportChangeDebounced = useCallback((viewport: IViewport) => {
      setPadding(viewport.padding);
    }, []);

    //CALCULATE MAP PADDING ON DETAIL AND FILTERS TOGGLING
    useEffect(() => {
      //move the mapbox logo
      const mapboxLogoElement = document.querySelector(
        ".mapboxgl-ctrl-bottom-left"
      );
      const informationElement = document.querySelector(
        ".mapboxgl-ctrl-bottom-right"
      );
      if (!mapboxLogoElement || !informationElement) return;

      const mapboxLogoMobileStyle = `
        transition: transform 500ms;
        transform: translate(${controlsMargin?.left ?? 0 + 16}px, -2px);
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: 4px;
        margin-bottom: 0px;
      `;

      const mapboxLogoDesktopStyle = `
        transition: transform 500ms;
        transform: translate(${controlsMargin?.left ?? 0 + 16}px, -2px);
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: 8px;
        margin-bottom: -6px;
      `;

      const informationStyle = `
        transition: transform 500ms;
        transform: translate(-${
          controlsMargin?.right ? controlsMargin.right + 16 : 0
        }px);
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      `;

      mapboxLogoElement.setAttribute(
        "style",
        isMobile ? mapboxLogoMobileStyle : mapboxLogoDesktopStyle
      );
      informationElement.setAttribute("style", informationStyle);
    }, [controlsMargin, isMobile]);

    //SET MOBILE ACCORDING TO CONTAINER WIDTH
    useEffect(() => {
      setMobile((containerWidth ?? 0) < 640);
    }, [containerWidth, setMobile]);

    const mapContextValue: IMapContext = useMemo(
      () => ({
        isMobile,
      }),
      [isMobile]
    );

    return (
      <mapContext.Provider value={mapContextValue}>
        <div
          className={cx(
            "fixed z-50 top-0 right-0 bottom-0 left-0 bg-white flex items-center justify-center text-primary duration-500",
            {
              "visible opacity-100 transition-none": isLoading,
              "invisible opacity-0 transition-all": !isLoading,
            }
          )}
        >
          <LoadingSpinner />
        </div>
        <div ref={containerRef} className="w-full h-full text-font">
          <Mapbox
            defaultCenter={defaultCenter}
            ref={mapboxRef}
            isDarkmode={isDarkmode}
            isSatellite={isSatellite}
            isGeolocation={isGeolocation}
            layerPrefix={layerPrefix}
            mapStyles={mapStyles}
            mapboxgl={mapboxgl}
            sources={extendedSources}
            icons={icons}
            onFeatureClick={setSelectedFeatures}
            loadingState={[isLoading, setLoading]}
            selectedFeatures={selectedFeatures}
            onViewportChange={onViewportChange}
            onControlsMarginChange={setControlsMargin}
            onViewportChangeDebounced={onViewportChangeDebounced}
            isDevelopment={isDevelopment && isDevInfoVisible}
          >
            {children}
          </Mapbox>
          <ThemeController
            isDarkmode={isDarkmode}
            isSatellite={isSatellite}
            onDarkmodeChange={(value) => setDarkmode(value)}
            onSatelliteChange={(value) => setSatellite(value)}
            style={{
              transform: `translateX(${controlsMargin.left}px)`,
            }}
          />
          <ViewportController
            style={{
              transform: `translateX(-${controlsMargin.right}px)`,
            }}
            isFullscreen={isFullscreen}
            viewport={mapboxRef.current?.viewport}
            onZoomInClick={zoomIn}
            onZoomOutClick={zoomOut}
            onFullscreenClick={toggleFullscreen}
            onCompassClick={resetBearing}
            bearing={bearing}
            isGeolocation={isGeolocation}
            onLocationClick={() => setGeolocation(!isGeolocation)}
          />
        </div>
      </mapContext.Provider>
    );
  }
);

Map.displayName = "Map";

export default Map;
