import {
  LngLat,
  Mapbox,
  MapboxGesturesOptions,
  MapboxHandle,
  MapIcon,
  Marker,
  mergeViewports,
  PartialPadding,
  PartialViewport,
  Sources,
  Viewport,
} from "@bratislava/react-mapbox";
import { IconButton, LoadingSpinner, Modal } from "@bratislava/react-maps-ui";
import cx from "classnames";
import {
  createContext,
  Dispatch,
  forwardRef,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useResizeDetector } from "react-resize-detector";
import { IMapState, MapAction, MapActionKind, mapReducer } from "./mapReducer";

import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";
import {} from "../../types";

import {
  ArrowCounterclockwise,
  Feedback,
  InformationAlt,
} from "@bratislava/react-maps-icons";
import bbox from "@turf/bbox";
import { Feature } from "geojson";
import Mousetrap from "mousetrap";
import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";
import { getFeatureDistrict } from "../../utils/districts";
import { Slot } from "../Layout/Slot";
import { point } from "@turf/helpers";

export type IMapProps = {
  mapboxAccessToken: string;
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
  initialViewport?: PartialViewport;
  onSelectedFeaturesChange?: (features: Feature[]) => void;
  onMobileChange?: (isMobile: boolean) => void;
  onGeolocationChange?: (isGeolocation: boolean) => void;
  onMapClick?: (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => void;
  loadingSpinnerColor?: string;
  selectedFeatures?: MapboxGeoJSONFeature[];
  onFeaturesClick?: (features: MapboxGeoJSONFeature[]) => void;
  maxBounds?: [[number, number], [number, number]];
  cooperativeGestures?: boolean;
  interactive?: boolean;
  scrollZoomBlockerCtrlMessage: string;
  scrollZoomBlockerCmdMessage: string;
  touchPanBlockerMessage: string;
  errors: {
    generic: string;
    notLocatedInBratislava: string;
    noGeolocationSupport: string;
  };
  mapInformationButtonClassName?: string;
  mapInformation: {
    title: string;
    description: ReactNode;
    partners: {
      name: string;
      link: string;
      image: string;
      height?: number;
      width?: number;
    }[];
    footer: ReactNode;
  };
} & MapboxGesturesOptions;

export interface IMapMethods {
  changeViewport: (
    wantedViewport: PartialViewport,
    duration?: number
  ) => void | undefined;
  fitDistrict: (district: string | string[]) => void;
  fitBounds: (
    bounds: mapboxgl.LngLatBoundsLike,
    options?: mapboxgl.FitBoundsOptions
  ) => void;
  fitFeature: (
    features: Feature | Feature[],
    options?: { padding?: number }
  ) => void;
  moveToFeatures: (
    features: Feature | Feature[],
    options?: { zoom?: number }
  ) => void;
  turnOnGeolocation: () => void;
  turnOffGeolocation: () => void;
  toggleGeolocation: () => void;
  changeMargin: (margin: PartialPadding) => void;
  addSearchMarker: (lngLat: LngLat) => void;
  removeSearchMarker: () => void;
}

export type MapHandle = IMapMethods;

export interface IMapContext {
  mapboxAccessToken: string;
  mapState: IMapState | null;
  dispatchMapState: Dispatch<MapAction> | null;
  containerRef: MutableRefObject<HTMLDivElement | null> | null;
  isMobile: boolean | null;
  methods: IMapMethods;
}

export const mapContext = createContext<IMapContext>({
  mapboxAccessToken: "",
  mapState: null,
  dispatchMapState: null,
  containerRef: null,
  isMobile: false,
  methods: {
    changeViewport: () => void 0,
    fitDistrict: () => void 0,
    fitBounds: () => void 0,
    fitFeature: () => void 0,
    moveToFeatures: () => void 0,
    turnOnGeolocation: () => void 0,
    turnOffGeolocation: () => void 0,
    toggleGeolocation: () => void 0,
    changeMargin: () => void 0,
    addSearchMarker: () => void 0,
    removeSearchMarker: () => void 0,
  },
});

export const Map = forwardRef<MapHandle, IMapProps>(
  (
    {
      mapboxAccessToken,
      sources,
      icons,
      mapStyles,
      children,
      layerPrefix = "BRATISLAVA",
      isDevelopment = false,
      initialViewport: inputInitialViewport,
      selectedFeatures,
      onMobileChange,
      onGeolocationChange,
      loadingSpinnerColor,
      onMapClick,
      onFeaturesClick,
      disablePitch,
      disableBearing,
      maxBounds,
      cooperativeGestures = false,
      interactive,
      scrollZoomBlockerCtrlMessage,
      scrollZoomBlockerCmdMessage,
      touchPanBlockerMessage,
      errors,
      mapInformation,
      mapInformationButtonClassName,
    },
    forwardedRef
  ) => {
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
      searchMarkerLngLat: null,
    });

    const [isMobile, setMobile] = useState<boolean | null>(null);
    const [isLoading, setLoading] = useState(true);

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
                  alert(errors.notLocatedInBratislava);
                  return;
                }

                console.log("ADDING GEOLOCATION MARKER");
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
                alert(`${errors.generic}: ${error.message}`);
              }
            );
          } else {
            alert(errors.noGeolocationSupport);
          }
        } else {
          dispatchMapState({
            type: MapActionKind.DisableGeolocation,
          });
        }
      },
      [
        errors.generic,
        errors.noGeolocationSupport,
        errors.notLocatedInBratislava,
      ]
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
    } = useResizeDetector<HTMLDivElement | null>();

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

    const changeViewport = (
      wantedViewport: PartialViewport,
      duration?: number
    ) => mapboxRef?.current?.changeViewport(wantedViewport, duration);

    const fitDistrict = (district: string | string[]) => {
      if (!mapboxRef.current) return;
      const MAP = mapboxRef.current;

      const districts = Array.isArray(district) ? district : [district];

      const districtFeatures = DISTRICTS_GEOJSON.features.filter(
        (feature) => districts.indexOf(feature.properties.name) !== -1
      );

      if (!districtFeatures.length) return;

      const boundingBox = bbox({
        type: "FeatureCollection",
        features: districtFeatures,
      }) as [number, number, number, number];

      MAP.fitBounds(boundingBox, { padding: 128 });
    };

    const fitBounds = (
      bounds: mapboxgl.LngLatBoundsLike,
      options?: mapboxgl.FitBoundsOptions
    ) => {
      if (!mapboxRef.current) return;
      const MAP = mapboxRef.current;
      MAP.fitBounds(bounds, options);
    };

    const fitFeature = (
      features: Feature | Feature[],
      options?: { padding?: number }
    ) => {
      if (!mapboxRef.current) return;
      const MAP = mapboxRef.current;

      const boundingBox = bbox({
        type: "FeatureCollection",
        features: Array.isArray(features) ? features : [features],
      }) as [number, number, number, number];

      MAP.fitBounds(boundingBox, {
        padding: options?.padding ?? 128,
        bearing: 0,
        pitch: 0,
        duration: 500,
      });
    };

    const moveToFeatures = (
      features: Feature | Feature[],
      options?: { zoom?: number }
    ) => {
      if (!mapboxRef.current) return;
      const MAP = mapboxRef.current;

      const [minX, minY, maxX, maxY] = bbox({
        type: "FeatureCollection",
        features: Array.isArray(features) ? features : [features],
      }) as [number, number, number, number];

      const lng = (minX + maxX) / 2;
      const lat = (minY + maxY) / 2;

      MAP.changeViewport({
        center: {
          lat,
          lng,
        },
        zoom: options?.zoom,
      });
    };

    const changeMargin = (margin: PartialPadding) => {
      if (margin.top !== undefined) setControlsMarginTop(margin.top);
      if (margin.right !== undefined) setControlsMarginRight(margin.right);
      if (margin.bottom !== undefined) setControlsMarginBottom(margin.bottom);
      if (margin.left !== undefined) setControlsMarginLeft(margin.left);
    };

    const addSearchMarker = (lngLat: LngLat) => {
      dispatchMapState({
        type: MapActionKind.AddSearchMarker,
        searchMarkerLngLat: lngLat,
      });
    };

    const removeSearchMarker = () => {
      dispatchMapState({
        type: MapActionKind.RemoveSearchMarker,
      });
    };

    const mapMethods = useMemo(
      () => ({
        changeViewport,
        fitDistrict,
        fitBounds,
        fitFeature,
        moveToFeatures,
        changeMargin,
        turnOnGeolocation: () => geolocationChangeHandler(true),
        turnOffGeolocation: () => geolocationChangeHandler(false),
        toggleGeolocation: () =>
          geolocationChangeHandler(!mapState.isGeolocation),
        addSearchMarker,
        removeSearchMarker,
      }),
      [geolocationChangeHandler, mapState.isGeolocation]
    );

    // EXPOSING METHODS FOR PARENT COMPONENT
    useImperativeHandle(forwardedRef, () => mapMethods, [mapMethods]);

    const onViewportChange = useCallback((viewport: Viewport) => {
      dispatchMapState({
        type: MapActionKind.ChangeViewport,
        viewport,
      });
    }, []);

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
        0
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

    // CALCULATE MAP PADDING ON DETAIL AND FILTERS TOGGLING
    useEffect(() => {
      // move the mapbox logo
      const mapboxLogoElement = document.querySelector(
        ".mapboxgl-ctrl-bottom-left"
      );
      const informationElement = document.querySelector(
        ".mapboxgl-ctrl-bottom-right .mapboxgl-ctrl"
      );
      if (!mapboxLogoElement || !informationElement) return;

      const mapboxLogoStyle = `
        transition: transform 500ms;
        transform: translate(${controlsMarginLeft ?? 0 + 8}px, ${
        -controlsMarginBottom - 2
      }px);
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: 8px;
        margin-bottom: -2px;
      `;

      const informationStyle = `
        transition: transform 500ms;
        transform: translate(-${controlsMarginRight + 16}px, ${
        -controlsMarginBottom - 2
      }px);
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        margin: 0 !important;
        margin-bottom: 4px !important;
      `;

      mapboxLogoElement.setAttribute("style", mapboxLogoStyle);
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
        mapboxAccessToken,
        mapState,
        dispatchMapState,
        isMobile,
        containerRef,
        methods: mapMethods,
      }),
      [mapboxAccessToken, mapState, isMobile, containerRef, mapMethods]
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

    const mapboxLocale = useMemo(
      () => ({
        "ScrollZoomBlocker.CtrlMessage": scrollZoomBlockerCtrlMessage,
        "ScrollZoomBlocker.CmdMessage": scrollZoomBlockerCmdMessage,
        "TouchPanBlocker.Message": touchPanBlockerMessage,
      }),
      [
        scrollZoomBlockerCtrlMessage,
        scrollZoomBlockerCmdMessage,
        touchPanBlockerMessage,
      ]
    );

    const [isInformationModalOpen, setInformationModalOpen] = useState(false);

    return (
      <div className={cx("h-full w-full relative text-foreground-lightmode")}>
        <mapContext.Provider value={mapContextValue}>
          <div
            ref={containerRef}
            className="w-full h-full relative z-10 text-font dark:text-foreground-darkmode"
          >
            <Mapbox
              interactive={interactive}
              initialViewport={initialViewport}
              ref={mapboxRef}
              isDarkmode={mapState.isDarkmode}
              isSatellite={mapState.isSatellite}
              layerPrefix={layerPrefix}
              mapStyles={mapStyles}
              mapboxAccessToken={mapboxAccessToken}
              sources={sources}
              icons={icons}
              onFeaturesClick={onFeaturesClick}
              selectedFeatures={selectedFeatures}
              onLoad={onLoad}
              onClick={onMapClick}
              onViewportChange={onViewportChange}
              isDevelopment={isDevelopment && isDevInfoVisible}
              disablePitch={disablePitch}
              disableBearing={disableBearing}
              maxBounds={maxBounds}
              cooperativeGestures={cooperativeGestures}
              locale={mapboxLocale}
            >
              {/* information button */}
              <Slot name="information-button">
                <IconButton
                  onClick={() => setInformationModalOpen(true)}
                  className={cx(
                    "absolute left-4 top-4 w-8 h-8 sm:top-6 sm:left-auto sm:right-6 rounded-full",
                    mapInformationButtonClassName
                  )}
                >
                  <InformationAlt size="sm" />
                </IconButton>
              </Slot>

              <>{children}</>

              {/* geolocation marker */}
              {mapState.isGeolocation && mapState.geolocationMarkerLngLat && (
                <Marker
                  feature={{
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [
                        mapState.geolocationMarkerLngLat.lng,
                        mapState.geolocationMarkerLngLat.lat,
                      ],
                    },
                    properties: {},
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="opacity-20 flex items-center justify-center">
                      <div className="absolute bg-gray-lightmode dark:bg-gray-darkmode w-20 h-20 rounded-full animate-ping"></div>
                    </div>
                    <div className="absolute w-4 h-4 bg-white dark:bg-black border-4 border-black dark:border-white rounded-full"></div>
                  </div>
                </Marker>
              )}

              {/* search marker */}
              {mapState.searchMarkerLngLat && (
                <Marker
                  feature={point([
                    mapState.searchMarkerLngLat.lng,
                    mapState.searchMarkerLngLat.lat,
                  ])}
                  isRelativeToZoom
                  className="relative"
                >
                  <div className="bg-primary w-4 h-4 rotate-45 rounded-full rounded-br-none p-1"></div>
                </Marker>
              )}
            </Mapbox>
          </div>
        </mapContext.Provider>
        <div
          className={cx(
            "fixed select-none dark:text-foreground-darkmode z-50 top-0 right-0 bottom-0 left-0 bg-background-lightmode dark:bg-background-darkmode flex items-center justify-center text-primary transition-all delay-1000 duration-1000",
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
              <a
                href="mailto:mapy.inovacie@bratislava.sk"
                className="underline"
              >
                mapy.inovacie@bratislava.sk
              </a>
            </div>
          </div>
        </Modal>

        <Modal
          className="max-w-xl !p-0"
          isOpen={isInformationModalOpen}
          closeButtonInCorner
          onClose={() => setInformationModalOpen(false)}
        >
          <div className="flex flex-col gap-6 pt-6">
            <div className="font-medium text-md px-6">
              {mapInformation.title}
            </div>
            <div className="px-6">{mapInformation.description}</div>
            <div className="flex flex-wrap px-6 justify-center items-center gap-4 py-2">
              {mapInformation.partners.map((partner, index) => (
                <a
                  key={index}
                  target="_blank"
                  href={partner.link}
                  className="block"
                  rel="noreferrer"
                >
                  <img
                    className="object-contain"
                    style={{
                      height: partner.height ?? 36,
                      width: partner.width ?? "auto",
                    }}
                    src={partner.image}
                    alt={partner.name}
                  />
                </a>
              ))}
            </div>
            <div className="bg-gray-lightmode/5 dark:bg-gray-darkmode/10 px-6 py-4 flex gap-5 items-center">
              <Feedback size="xl" />
              <div className="text-[14px]">{mapInformation.footer}</div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
);

Map.displayName = "Map";

export default Map;
