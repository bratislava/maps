import '../../styles/mapbox-corrections.css';
import { DISTRICTS_GEOJSON } from '@bratislava/geojson-data';
import {
  LngLat,
  Mapbox,
  MapboxHandle,
  Marker,
  mergeViewports,
  PartialViewport,
  Viewport,
} from '@bratislava/react-mapbox';
import {
  ArrowCounterclockwise,
  Feedback,
  InformationAlt,
} from '@bratislava/react-maps-icons';
import { IconButton, Modal } from '@bratislava/react-maps-ui';
import bbox from '@turf/bbox';
import cx from 'classnames';
import { Feature } from 'geojson';
import { FitBoundsOptions, LngLatBoundsLike } from 'mapbox-gl';
import Mousetrap from 'mousetrap';
import {
  createContext,
  Dispatch,
  forwardRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useResizeDetector } from 'react-resize-detector';
import i18n from '../../utils/i18n';

import { getFeatureDistrict } from '../../utils/districts';
import { Slot } from '../Layout/Slot';
import { IMapState, MapAction, MapActionKind, mapReducer } from './mapReducer';
import { SearchMarker } from '../SearchMarker/SearchMarker';
import { defaultInitialViewport } from '@bratislava/react-mapbox/src/utils/constants';
import { MapMethods, MapProps, SlotState } from './types';

export type MapHandle = MapMethods;

export interface IMapContext {
  mapboxAccessToken: string;
  mapState: IMapState | null;
  dispatchMapState: Dispatch<MapAction> | null;
  containerRef: MutableRefObject<HTMLDivElement | null> | null;
  isMobile: boolean | null;
  methods: MapMethods;
}

export const mapContext = createContext<IMapContext>({
  mapboxAccessToken: '',
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
    addSearchMarker: () => void 0,
    removeSearchMarker: () => void 0,
    mountOrUpdateSlot: () => void 0,
    unmountSlot: () => void 0,
  },
});

const MapWithoutTranslations = forwardRef<MapHandle, MapProps>(
  (
    {
      mapboxAccessToken,
      mapStyles,
      children,
      layerPrefix = 'BRATISLAVA',
      isDevelopment = false,
      initialViewport,
      selectedFeatures,
      onMobileChange,
      onGeolocationChange,
      onMapClick,
      onFeaturesClick,
      disablePitch,
      disableBearing,
      maxBounds,
      cooperativeGestures = false,
      interactive,
      enableSatelliteOnLoad = false,
      mapInformation,
      mapInformationButtonClassName,
      prevI18n,
      onViewportChange,
      onViewportChangeDebounced,
    },
    forwardedRef,
  ) => {
    const mapboxRef = useRef<MapboxHandle>(null);

    const { t } = useTranslation('maps', {
      keyPrefix: 'components.Map',
    });

    const [isDevInfoVisible, setDevInfoVisible] = useState(false);

    const [slotStates, setSlotStates] = useState<SlotState[]>([]);

    const [mapState, dispatchMapState] = useReducer(mapReducer, {
      isDarkmode: false,
      isSatellite: enableSatelliteOnLoad,
      isFullscreen: false,
      viewport: mergeViewports(defaultInitialViewport, initialViewport ?? {}),
      isGeolocation: false,
      geolocationMarkerLngLat: null,
      searchMarkerLngLat: null,
    });

    const [isMobile, setMobile] = useState<boolean | null>(null);

    const geolocationChangeHandler = useCallback(
      (isGeolocation: boolean) => {
        if (isGeolocation) {
          // if browser supports geolocation
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const geolocationMarkerLngLat = {
                  lng: position.coords.longitude,
                  lat: position.coords.latitude,
                };

                const isInBratislava = !!getFeatureDistrict({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [
                      geolocationMarkerLngLat.lng,
                      geolocationMarkerLngLat.lat,
                    ],
                  },
                  properties: {},
                });

                if (!isInBratislava) {
                  alert(t('errors.notLocatedInBratislava'));
                  return;
                }

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
                alert(`${t('errors.generic')}: ${error.message}`);
              },
            );
          } else {
            alert(t('errors.noGeolocationSupport'));
          }
        } else {
          dispatchMapState({
            type: MapActionKind.DisableGeolocation,
          });
        }
      },
      [t],
    );

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
          ['ctrl+shift+d', 'command+shift+d'],
          () => {
            toggleDevInfo();
            return false;
          },
        );
        return () => {
          moustrapBind.unbind(['ctrl+shift+d', 'command+shift+d']);
        };
      }
    }, [isDevelopment, toggleDevInfo]);

    const changeViewport = (
      wantedViewport: PartialViewport,
      duration?: number,
    ) => mapboxRef?.current?.changeViewport(wantedViewport, duration);

    const fitDistrict = (district: string | string[]) => {
      if (!mapboxRef.current) return;
      const MAP = mapboxRef.current;

      const districts = Array.isArray(district) ? district : [district];

      const districtFeatures = DISTRICTS_GEOJSON.features.filter((feature) =>
        districts.includes(feature.properties.name),
      );

      if (districtFeatures.length === 0) return;

      const boundingBox = bbox({
        type: 'FeatureCollection',
        features: districtFeatures,
      }) as [number, number, number, number];

      MAP.fitBounds(boundingBox, { padding: 128 });
    };

    const fitBounds = (
      bounds: LngLatBoundsLike,
      options?: FitBoundsOptions,
    ) => {
      if (!mapboxRef.current) return;
      const MAP = mapboxRef.current;
      MAP.fitBounds(bounds, options);
    };

    const fitFeature = (
      features: Feature | Feature[],
      options?: { padding?: number },
    ) => {
      if (!mapboxRef.current) return;
      const MAP = mapboxRef.current;

      const boundingBox = bbox({
        type: 'FeatureCollection',
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
      options?: { zoom?: number },
    ) => {
      if (!mapboxRef.current) return;
      const MAP = mapboxRef.current;

      const [minX, minY, maxX, maxY] = bbox({
        type: 'FeatureCollection',
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

    const unmountSlot = useCallback((slotState: SlotState) => {
      setSlotStates((slotStates) => {
        return slotStates.filter((s) => s.id !== slotState.id);
      });
    }, []);

    const mountOrUpdateSlot = useCallback((slotState: SlotState) => {
      setSlotStates((slotStates) => {
        const foundSlotIndex = slotStates.findIndex(
          (s) => s.id === slotState.id,
        );

        let newSlotStates = [];
        if (foundSlotIndex >= 0) {
          newSlotStates = [...slotStates];
          newSlotStates[foundSlotIndex] = slotState;
        } else {
          newSlotStates = [...slotStates, slotState];
        }

        return newSlotStates;
      });
    }, []);

    const finalPadding = useMemo(() => {
      const top = Math.max(
        ...slotStates.map((slotState) => slotState.padding.top),
      );
      const right = Math.max(
        ...slotStates.map((slotState) => slotState.padding.right),
      );
      const bottom = Math.max(
        ...slotStates.map((slotState) => slotState.padding.bottom),
      );
      const left = Math.max(
        ...slotStates.map((slotState) => slotState.padding.left),
      );
      return { top, right, bottom, left };
    }, [slotStates]);

    const finalMapboxControlsPadding = useMemo(() => {
      const top = Math.max(
        ...slotStates
          .filter((slotState) => slotState.avoidMapboxControls)
          .map((slotState) => slotState.padding.top),
      );
      const right = Math.max(
        ...slotStates
          .filter((slotState) => slotState.avoidMapboxControls)
          .map((slotState) => slotState.padding.right),
      );
      const bottom = Math.max(
        ...slotStates
          .filter((slotState) => slotState.avoidMapboxControls)
          .map((slotState) => slotState.padding.bottom),
      );
      const left = Math.max(
        ...slotStates
          .filter((slotState) => slotState.avoidMapboxControls)
          .map((slotState) => slotState.padding.left),
      );
      return { top, right, bottom, left };
    }, [slotStates]);

    useEffect(() => {
      changeViewport({ padding: finalPadding });
    }, [finalPadding]);

    const mapMethods: MapMethods = useMemo(
      () => ({
        changeViewport,
        fitDistrict,
        fitBounds,
        fitFeature,
        moveToFeatures,
        turnOnGeolocation: () => geolocationChangeHandler(true),
        turnOffGeolocation: () => geolocationChangeHandler(false),
        toggleGeolocation: () =>
          geolocationChangeHandler(!mapState.isGeolocation),
        addSearchMarker,
        removeSearchMarker,
        mountOrUpdateSlot,
        unmountSlot,
      }),
      [
        geolocationChangeHandler,
        mapState.isGeolocation,
        mountOrUpdateSlot,
        unmountSlot,
      ],
    );

    // EXPOSING METHODS FOR PARENT COMPONENT
    useImperativeHandle(forwardedRef, () => mapMethods, [mapMethods]);

    const handleViewportChange = useCallback(
      (viewport: Viewport) => {
        if (onViewportChange) onViewportChange(viewport);
        dispatchMapState({
          type: MapActionKind.ChangeViewport,
          viewport,
        });
      },
      [onViewportChange],
    );

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
        0,
      );
    }, [onMobileChange, isMobile]);

    useEffect(() => {
      onGeolocationChange && onGeolocationChange(mapState.isGeolocation);
    }, [onGeolocationChange, mapState.isGeolocation]);

    // CALCULATE MAP PADDING ON DETAIL AND FILTERS TOGGLING
    useEffect(() => {
      const mapboxLogoElement = document.querySelector(
        '.mapboxgl-ctrl-bottom-left',
      );
      const informationElement = document.querySelector(
        '.mapboxgl-ctrl-bottom-right',
      );
      if (!mapboxLogoElement || !informationElement) return;

      const mapboxLogoStyle = `
        transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
        transform: translate(${finalMapboxControlsPadding.left}px, -${finalMapboxControlsPadding.bottom}px);
        bottom: 8px; left: 8px;
      `;

      const informationStyle = `
        transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
        transform: translate(-${finalMapboxControlsPadding.right}px, -${finalMapboxControlsPadding.bottom}px);
        bottom: 8px; right: 8px;
      `;

      mapboxLogoElement.setAttribute('style', mapboxLogoStyle);
      informationElement.setAttribute('style', informationStyle);
    }, [
      finalMapboxControlsPadding.bottom,
      finalMapboxControlsPadding.left,
      finalMapboxControlsPadding.right,
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
      [mapboxAccessToken, mapState, isMobile, containerRef, mapMethods],
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
        'ScrollZoomBlocker.CtrlMessage': t(
          'tooltips.scrollZoomBlockerCtrlMessage',
        ),
        'ScrollZoomBlocker.CmdMessage': t(
          'tooltips.scrollZoomBlockerCmdMessage',
        ),
        'TouchPanBlocker.Message': t('tooltips.touchPanBlockerMessage'),
      }),
      [t],
    );

    const [isInformationModalOpen, setInformationModalOpen] = useState(false);

    return (
      <I18nextProvider i18n={prevI18n}>
        <div className={cx('h-full w-full relative text-foreground-lightmode')}>
          <mapContext.Provider value={mapContextValue}>
            <div
              ref={containerRef}
              className="text-font dark:text-foreground-darkmode relative z-10 h-full w-full"
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
                onFeaturesClick={onFeaturesClick}
                selectedFeatures={selectedFeatures}
                onClick={onMapClick}
                onViewportChange={handleViewportChange}
                onViewportChangeDebounced={onViewportChangeDebounced}
                isDevelopment={isDevelopment && isDevInfoVisible}
                disablePitch={disablePitch}
                disableBearing={disableBearing}
                maxBounds={maxBounds}
                cooperativeGestures={cooperativeGestures}
                locale={mapboxLocale}
              >
                {/* information button */}
                <Slot id="information-button">
                  <IconButton
                    onClick={() => setInformationModalOpen(true)}
                    className={cx(
                      'fixed left-4 top-4 w-8 h-8 sm:top-6 sm:left-auto sm:right-6 !rounded-full',
                      mapInformationButtonClassName,
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
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: [
                          mapState.geolocationMarkerLngLat.lng,
                          mapState.geolocationMarkerLngLat.lat,
                        ],
                      },
                      properties: {},
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="flex items-center justify-center opacity-20">
                        <div className="bg-gray-lightmode dark:bg-gray-darkmode absolute h-20 w-20 animate-ping rounded-full" />
                      </div>
                      <div className="absolute h-4 w-4 rounded-full border-4 border-black bg-white dark:border-white dark:bg-black" />
                    </div>
                  </Marker>
                )}

                {/* search marker */}
                {mapState.searchMarkerLngLat && (
                  <SearchMarker {...mapState.searchMarkerLngLat} />
                )}
              </Mapbox>
            </div>
          </mapContext.Provider>

          <Modal
            overlayClassName="max-w-xs"
            isOpen={isDisplayLandscapeModal}
            closeButtonIcon={
              <ArrowCounterclockwise size="lg" className="text-white" />
            }
          >
            <div className="flex flex-col gap-2 pb-4 text-center">
              <div>
                Na mobilnom zariadení je mapu najlepšie používať na výšku
              </div>
              <div className="text-[14px]">
                Zanechajte nám spätnú väzbu na adrese{' '}
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
            overlayClassName="max-w-xl !p-0"
            isOpen={isInformationModalOpen}
            closeButtonInCorner
            onClose={() => setInformationModalOpen(false)}
          >
            <div className="flex flex-col gap-6 pt-6">
              <div className="text-md px-6 font-medium">
                {mapInformation.title}
              </div>
              <div className="px-6">{mapInformation.description}</div>
              <div className="flex flex-wrap items-center justify-center gap-4 px-6 py-2">
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
                        width: partner.width ?? 'auto',
                      }}
                      src={partner.image}
                      alt={partner.name}
                    />
                  </a>
                ))}
              </div>
              <div className="bg-gray-lightmode/5 dark:bg-gray-darkmode/10 flex items-center gap-5 px-6 py-4">
                <Feedback size="xl" />
                <div className="text-[14px]">{mapInformation.footer}</div>
              </div>
            </div>
          </Modal>
        </div>
      </I18nextProvider>
    );
  },
);

MapWithoutTranslations.displayName = 'MapWithoutTranslations';

export const Map = forwardRef<MapHandle, Omit<MapProps, 'prevI18n'>>(
  (props, forwardedRef) => {
    const { i18n: prevI18n } = useTranslation();

    return (
      <I18nextProvider i18n={i18n}>
        <MapWithoutTranslations
          {...props}
          ref={forwardedRef}
          prevI18n={prevI18n}
        />
      </I18nextProvider>
    );
  },
);

Map.displayName = 'Map';
