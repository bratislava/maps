import { useEffectDebugger, usePrevious } from '@bratislava/utils';
import mapboxgl, { MapboxGeoJSONFeature } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { PartialViewport, Viewport } from '../../types';
import { DevelopmentInfo } from '../DevelopmentInfo/DevelopmentInfo';
import {
  mergeViewports,
  ViewportActionKind,
  viewportReducer,
} from './viewportReducer';
import { useDebounce } from 'usehooks-ts';
import {
  defaultInitialViewport,
  defaultSatelliteSource,
} from '../../utils/constants';

export type MapboxGesturesOptions = {
  disableBearing?: boolean;
  disablePitch?: boolean;
};

export type MapboxProps = {
  mapboxAccessToken: string;
  isDarkmode?: boolean;
  isSatellite?: boolean;
  mapStyles?: {
    [key: string]: string;
  };
  selectedFeatures?: MapboxGeoJSONFeature[];
  onFeaturesClick?: (features: MapboxGeoJSONFeature[]) => void;
  children?: ReactNode;
  layerPrefix?: string;
  onViewportChange?: (viewport: Viewport) => void;
  onViewportChangeDebounced?: (viewport: Viewport) => void;
  onLoad?: () => void;
  initialViewport?: PartialViewport;
  isDevelopment?: boolean;
  onClick?: (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => void;
  onCustomFeaturesClickOutside?: () => void;
  maxBounds?: [[number, number], [number, number]];
  cooperativeGestures?: boolean;
  locale?: { [key: string]: string };
  interactive?: boolean;
} & MapboxGesturesOptions;

export interface ISlotPadding {
  isVisible: boolean;
  padding: { top?: number; right?: number; bottom?: number; left?: number };
  name: string;
  avoidControls: boolean;
}

export interface IContext {
  map: mapboxgl.Map | null;
  isLoading: boolean;
  isStyleLoading: boolean;
  getPrefixedLayer: (layerId: string) => string;
  isLayerPrefixed: (layerId: string) => boolean;
  addClickableLayer: (layerId: string) => void;
  changeViewport: (viewport: PartialViewport, duration?: number) => void;
  layerPrefix: string;
}

export const mapboxContext = createContext<IContext>({
  map: null,
  isLoading: true,
  isStyleLoading: true,
  getPrefixedLayer: () => '',
  isLayerPrefixed: () => false,
  addClickableLayer: () => void 0,
  changeViewport: () => void 0,
  layerPrefix: '',
});

export type MapboxHandle = {
  changeViewport: (viewport: PartialViewport, duration?: number) => void;
  fitBounds: (
    bounds: mapboxgl.LngLatBoundsLike,
    options?: mapboxgl.FitBoundsOptions,
  ) => void;
};

export const Mapbox = forwardRef<MapboxHandle, MapboxProps>(
  (
    {
      isDarkmode = false,
      isSatellite = false,
      selectedFeatures,
      mapStyles,
      onFeaturesClick,
      mapboxAccessToken,
      children,
      layerPrefix = 'BRATISLAVA',
      onViewportChange,
      onViewportChangeDebounced,
      initialViewport: inputInitialViewport,
      isDevelopment = false,
      onLoad,
      onClick,
      onCustomFeaturesClickOutside,
      disableBearing = false,
      disablePitch = false,
      maxBounds,
      locale,
      cooperativeGestures = false,
      interactive = true,
    },
    forwardedRef,
  ) => {
    const mapContainerId = useId();

    const [map, setMap] = useState<mapboxgl.Map | null>(null);

    const [isDragging, setDragging] = useState(false);

    const [clickableLayerIds, setClickableLayerIds] = useState<string[]>([]);

    const addClickableLayer = useCallback(
      (layerId: string) => {
        setClickableLayerIds((clickableLayerIds) => [
          ...clickableLayerIds,
          layerId,
        ]);
      },
      [setClickableLayerIds],
    );

    const [initialViewport] = useState(
      mergeViewports(defaultInitialViewport, inputInitialViewport ?? {}),
    );

    // Viewport where map is going
    const [futureViewport, dispatchFutureViewport] = useReducer(
      viewportReducer,
      initialViewport,
    );

    // Current viewport
    const [viewport, dispatchViewport] = useReducer(
      viewportReducer,
      initialViewport,
    );

    // Debounced current viewport
    const debouncedViewport = useDebounce(viewport, 100);

    useEffect(() => {
      dispatchFutureViewport({
        type: ViewportActionKind.Change,
        partialViewport: debouncedViewport,
      });
    }, [debouncedViewport]);

    const fitBounds = useCallback(
      (
        bounds: mapboxgl.LngLatBoundsLike,
        options?: mapboxgl.FitBoundsOptions,
      ) => {
        if (!map) return;
        map.fitBounds(bounds, options);
      },
      [map],
    );

    const changeViewport = useCallback(
      (partialViewport: PartialViewport, duration = 1000) => {
        if (!map) return;

        const newFutureViewport = mergeViewports(
          futureViewport,
          partialViewport,
        );

        if (
          JSON.stringify(futureViewport) !== JSON.stringify(newFutureViewport)
        ) {
          dispatchFutureViewport({
            type: ViewportActionKind.Change,
            partialViewport: newFutureViewport,
          });
          // if (duration === 0) {
          //   map.jumpTo({
          //     ...newFutureViewport,
          //   });
          // } else {
          //   map.easeTo({
          //     ...newFutureViewport,
          //     duration,
          //   });
          // }
        }
      },
      [map, futureViewport],
    );

    const [debouncedFutureViewport, setDebouncedFutureViewport] =
      useState(futureViewport);

    const previousDebouncedFutureViewport = usePrevious(
      debouncedFutureViewport,
    );

    useEffect(() => {
      const timer =
        !isDragging &&
        setTimeout(() => setDebouncedFutureViewport(futureViewport), 100);

      return () => {
        timer && clearTimeout(timer);
      };
    }, [futureViewport, isDragging]);

    useEffect(() => {
      if (!map) return;

      if (
        JSON.stringify(debouncedFutureViewport) !==
        JSON.stringify(previousDebouncedFutureViewport)
      ) {
        map.easeTo({
          ...debouncedFutureViewport,
          duration: 500,
        });
      }
    }, [debouncedFutureViewport, previousDebouncedFutureViewport]);

    const [isLoading, setLoading] = useState(true);
    const [isStyleLoading, setStyleLoading] = useState(false);

    const previousLoading = usePrevious(isLoading);
    const prevSelectedFeatures = usePrevious(selectedFeatures);
    const prevClickableLayerIds = usePrevious(clickableLayerIds);

    // CREATE NEW LAYER ID BY ADDING PREFIX
    const getPrefixedLayer = useCallback(
      (id: string) => `${layerPrefix}-${id}`,
      [layerPrefix],
    );

    // CHECK IF LAYER ID CONTAINS PREFIX
    const isLayerPrefixed = useCallback(
      (id: string) => id.startsWith(layerPrefix),
      [layerPrefix],
    );

    // CONTEXT VALUE PASSED TO ALL CHILDRENS
    const mapContextValue: IContext = useMemo(
      () => ({
        map,
        isLoading,
        getPrefixedLayer,
        isStyleLoading,
        isLayerPrefixed,
        addClickableLayer,
        changeViewport,
        layerPrefix,
      }),
      [
        map,
        isLoading,
        getPrefixedLayer,
        isStyleLoading,
        isLayerPrefixed,
        changeViewport,
        addClickableLayer,
        layerPrefix,
      ],
    );

    // LOADING SATELLITE SOURCE
    const loadSatelliteSource = useCallback(() => {
      if (!map || isStyleLoading || isLoading) return;

      if (!map.getSource('satellite')) {
        map.addSource('satellite', defaultSatelliteSource);
      }
    }, [map, isStyleLoading, isLoading]);

    // MAP CLICK HANDLER
    const onMapClick = useCallback(
      (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        onClick && onClick(event);

        if (!map) return;

        if (!clickableLayerIds.length) return;

        if (!event._defaultPrevented) {
          event.preventDefault();

          const features = map.queryRenderedFeatures(event.point);

          // filter only features from sources and from custom layers
          const filteredFeatures = features.reduce(
            (filteredFeatures, feature) => {
              if (
                // if layer id starts with prefix (custom layers from mapbox)
                feature.layer.id.startsWith(layerPrefix) &&
                // if feature from that source is not included already
                !filteredFeatures.find(
                  (filteredFeaturs) =>
                    filteredFeaturs.source === feature.source,
                ) &&
                // is clickable
                clickableLayerIds.find(
                  (clickableLayerId) => clickableLayerId === feature.layer.id,
                )
              ) {
                return [...filteredFeatures, feature];
                1;
              }
              return filteredFeatures;
            },
            [] as MapboxGeoJSONFeature[],
          );

          // if there is a symbol feature, ignore others
          const foundSymbolFeature = filteredFeatures.find((feature) => {
            return feature.layer.type === 'symbol';
          });

          if (foundSymbolFeature) {
            onFeaturesClick && onFeaturesClick([foundSymbolFeature]);
          } else {
            // /*
            //   Geometry objects in queried features in Mapbox are based on zoom level,
            //   so it is not precise enough.
            //   This will replace the queried geometry object with the source one.
            // */
            // const fixedFeatures = filteredFeatures.map((f) => {
            //   console.log(f.source);
            //   const source = map.getSource(f.source);
            //   if(source.type === 'geojson'){
            //     source.
            //   }
            //   console.log(source);
            //   return {
            //     ...f,
            //     geometry:
            //       sources &&
            //       sources[f.source].features.find(
            //         (sf: Feature) => sf.id === f.id,
            //       ).geometry,
            //   };
            // });

            if (filteredFeatures.length) {
              onFeaturesClick && onFeaturesClick(filteredFeatures);
            } else {
              onCustomFeaturesClickOutside && onCustomFeaturesClickOutside();
            }
          }
        }
      },
      [
        layerPrefix,
        onFeaturesClick,
        onCustomFeaturesClickOutside,
        clickableLayerIds,
        onClick,
        map,
      ],
    );

    // MAP MOVE HANDLER
    const onMapMove = useCallback(() => {
      if (!map) return;

      const center = map.getCenter();
      const zoom = map.getZoom();
      const pitch = map.getPitch();
      const bearing = map.getBearing();
      const padding = map.getPadding();

      setDragging(true);

      const viewport: Viewport = {
        center,
        zoom,
        bearing,
        pitch,
        padding,
      };

      dispatchViewport({
        type: ViewportActionKind.Change,
        partialViewport: viewport,
      });
    }, [map]);

    // MAP MOVEEND HANDLER
    const onMapMoveEnd = useCallback(() => {
      if (!map) return;

      const center = map.getCenter();
      const zoom = map.getZoom();
      const pitch = map.getPitch();
      const bearing = map.getBearing();
      const padding = map.getPadding();

      setDragging(false);

      const viewport: Viewport = {
        center,
        zoom,
        bearing,
        pitch,
        padding,
      };

      dispatchViewport({
        type: ViewportActionKind.Change,
        partialViewport: viewport,
      });
    }, [map]);

    // REGISTER MAP LAYER EVENT CALLBACKS
    const registerMapLayerEvents = useCallback(
      (customLayer: mapboxgl.Layer) => {
        if (!map) return;

        let hoveredFeatureId: string | number | undefined = undefined;
        map.on('mousemove', customLayer.id, (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];

            // if same feature is hovered
            if (hoveredFeatureId === feature.id) {
              return;
            }
            // if something was else was hovered then disable it
            else if (hoveredFeatureId !== undefined) {
              map.setFeatureState(
                {
                  source: feature.source,
                  id: hoveredFeatureId,
                  sourceLayer: customLayer['source-layer'],
                },
                { hover: false },
              );
            }
            // set hovered feature
            map.setFeatureState(
              {
                source: feature.source,
                id: feature.id,
                sourceLayer: customLayer['source-layer'],
              },
              { hover: true },
            );
            hoveredFeatureId = feature.id;

            if (
              clickableLayerIds.find(
                (clickableLayerId) => clickableLayerId === feature.layer.id,
              )
            ) {
              map.getCanvas().style.cursor = 'pointer';
            }
          }
        });

        map.on('mouseleave', customLayer.id, () => {
          if (hoveredFeatureId !== undefined) {
            map.setFeatureState(
              {
                source: customLayer.source as string,
                id: hoveredFeatureId,
                sourceLayer: customLayer['source-layer'],
              },
              { hover: false },
            );
          }
          hoveredFeatureId = undefined;
          map.getCanvas().style.cursor = 'default';
        });
      },
      [clickableLayerIds, map],
    );

    // CREATE MAP
    useEffectDebugger(
      () => {
        setLoading(true);

        setMap((map) => {
          map?.remove();

          // When initializing mapbox, there should not be any child in the root component
          const containerElement = document.getElementById(mapContainerId);
          while (containerElement?.firstChild) {
            containerElement.removeChild(containerElement.firstChild);
          }

          // Take the first style as initial or fallback to mapbox streets v11
          const initialStyle =
            typeof mapStyles === 'object'
              ? mapStyles[Object.keys(mapStyles)[0]]
              : 'mapbox://styles/mapbox/streets-v11';

          const newMap = new mapboxgl.Map({
            accessToken: mapboxAccessToken,
            container: mapContainerId,
            style: initialStyle,
            // maxZoom: 20,
            // minZoom: 10.75,
            cooperativeGestures,
            locale,
            maxBounds,
            zoom: initialViewport.zoom,
            pitch: initialViewport.pitch,
            bearing: initialViewport.bearing,
            center: [initialViewport.center.lng, initialViewport.center.lat],
          });

          newMap.on('load', () => {
            newMap.resize();
            newMap.getCanvas().style.cursor = 'default';
            setLoading(false);
          });

          return newMap;
        });
      },
      [
        cooperativeGestures,
        initialViewport.bearing,
        initialViewport.center.lng,
        initialViewport.center.lat,
        initialViewport.padding,
        initialViewport.pitch,
        initialViewport.zoom,
        mapContainerId,
      ],
      [
        'cooperativeGestures',
        'initialViewport.bearing',
        'initialViewport.center.lng',
        'initialViewport.center.lat',
        'initialViewport.padding',
        'initialViewport.pitch',
        'initialViewport.zoom',
        'mapContainerId',
      ],
      'CREATE MAP',
    );

    // REGISTER MAP EVENTS
    useEffectDebugger(
      () => {
        if (!map) return;

        if (
          (!isLoading && previousLoading) ||
          (!isLoading &&
            JSON.stringify(prevClickableLayerIds) !==
              JSON.stringify(clickableLayerIds))
        ) {
          // get custom layers (prefixed)
          const customLayers = map
            .getStyle()
            .layers.reduce((layers, layer: mapboxgl.Layer) => {
              if (
                isLayerPrefixed(layer.id) &&
                !layers.find((foundLayer) => foundLayer.source === layer.source)
              ) {
                return [...layers, layer];
              } else {
                return layers;
              }
            }, [] as mapboxgl.Layer[]);

          customLayers.forEach((customLayer) => {
            registerMapLayerEvents(customLayer);
          });
        }

        map.on('move', onMapMove);
        map.on('moveend', onMapMoveEnd);
        map.on('click', onMapClick);

        return () => {
          map.off('move', onMapMove);
          map.off('moveend', onMapMoveEnd);
          map.off('click', onMapClick);
        };
      },
      [
        previousLoading,
        isLoading,
        registerMapLayerEvents,
        isLayerPrefixed,
        onMapMove,
        onMapMoveEnd,
        onMapClick,
        clickableLayerIds,
        prevClickableLayerIds,
        map,
      ],
      [
        'previousLoading',
        'isLoading',
        'registerMapLayerEvents',
        'isLayerPrefixed',
        'onMapMove',
        'onMapMoveEnd',
        'onMapClick',
        'clickableLayerIds',
        'prevClickableLayerIds',
        'map',
      ],
      'REGISTER MAP EVENTS',
    );

    // REACT TO SELECTED FEATURES STATE CHANGES
    useEffectDebugger(
      () => {
        if (!map) return;

        // deselect previous selected features
        if (prevSelectedFeatures) {
          prevSelectedFeatures.forEach((feature) => {
            map.setFeatureState(
              {
                source: feature.source,
                id: feature.id,
                sourceLayer: feature.layer['source-layer'],
              },
              { selected: false },
            );
          });
        }

        // select the new selected features
        if (selectedFeatures) {
          selectedFeatures.forEach((feature) => {
            map.setFeatureState(
              {
                source: feature.source,
                id: feature.id,
                sourceLayer: feature.layer['source-layer'],
              },
              { selected: true },
            );
          });
        }
      },
      [prevSelectedFeatures, selectedFeatures, map],
      ['prevSelectedFeatures', 'selectedFeatures', 'map'],
      'SELECTED FEATURES',
    );

    // NEW STYLE
    useEffectDebugger(
      () => {
        if (!map) return;

        setStyleLoading(true);
        map.setStyle(
          (isDarkmode ? mapStyles?.['dark'] : mapStyles?.['light']) ??
            'mapbox://styles/mapbox/streets-v11',
        );

        map.on('style.load', () => {
          setStyleLoading(false);
        });
      },
      [isDarkmode, layerPrefix, mapStyles?.dark, mapStyles?.light, map],
      ['isDarkmode', 'layerPrefix', 'darkStyle', 'lightStyle', 'map'],
      'SET STYLE',
    );

    // SATELLITE CHANGE
    useEffectDebugger(
      () => {
        if (!map || isStyleLoading || isLoading) return;

        if (isSatellite) {
          loadSatelliteSource();
          if (!map.getLayer('satellite-raster')) {
            const layers = map.getStyle().layers;
            const bottomLayer = layers.find((layer) =>
              layer.id.startsWith(layerPrefix),
            );
            map.addLayer(
              {
                id: 'satellite-raster',
                type: 'raster',
                source: 'satellite',
              },
              bottomLayer?.id,
            );
          }
        } else {
          if (map.getLayer('satellite-raster')) {
            map.removeLayer('satellite-raster');
          }
        }
      },
      [
        loadSatelliteSource,
        isSatellite,
        layerPrefix,
        map,
        isStyleLoading,
        isLoading,
      ],
      [
        'loadSatelliteSource',
        'isSatellite',
        'layerPrefix',
        'map',
        'isStyleLoading',
        'isLoading',
      ],
      'SATELLITE CHANGE',
    );

    // EVENTS
    useEffect(() => {
      onViewportChange && onViewportChange(viewport);
    }, [map, viewport, onViewportChange]);

    useEffectDebugger(
      () => {
        onViewportChangeDebounced &&
          onViewportChangeDebounced(debouncedViewport);
      },
      [debouncedViewport, onViewportChangeDebounced],
      ['debouncedViewport', 'onViewportChangeDebounced'],
      'DEBOUNCED VIEWPORT',
    );

    // INTERACTIVITY CHANGE
    useEffectDebugger(
      () => {
        if (!map) return;
        if (interactive) {
          map.scrollZoom.enable();
          map.boxZoom.enable();
          map.dragPan.enable();
          map.keyboard.enable();
          map.doubleClickZoom.enable();
          map.touchZoomRotate.enable();
          if (disableBearing) {
            map.dragRotate.disable();
            map.touchZoomRotate.disableRotation();
          } else {
            map.dragRotate.enable();
            map.touchZoomRotate.enableRotation();
          }
          if (disablePitch) {
            map.touchPitch.disable();
          } else {
            map.touchPitch.enable();
          }
        } else {
          map.scrollZoom.disable();
          map.boxZoom.disable();
          map.dragRotate.disable();
          map.dragPan.disable();
          map.keyboard.disable();
          map.touchZoomRotate.disable();
          map.doubleClickZoom.disable();
          map.touchPitch.disable();
        }
      },
      [interactive, disableBearing, disablePitch, map],
      ['interactive', 'disableBearing', 'disablePitch', 'map'],
      'SET INTERACTIVITY',
    );

    useEffectDebugger(
      () => {
        if (isLoading === false && previousLoading === true) {
          onLoad && onLoad();
        }
      },
      [isLoading, onLoad, previousLoading],
      ['isLoading', 'onLoad', 'previousLoading'],
      'MAP LOADED',
    );

    // EXPOSING METHODS FOR PARENT COMPONENT
    useImperativeHandle(forwardedRef, () => ({
      changeViewport,
      fitBounds,
    }));

    return (
      <>
        <mapboxContext.Provider value={mapContextValue}>
          <div id={mapContainerId} style={{ width: '100%', height: '100%' }} />
          {children}
          <DevelopmentInfo isDevelopment={isDevelopment} viewport={viewport} />
        </mapboxContext.Provider>
      </>
    );
  },
);

Mapbox.displayName = 'Mapbox';

export default Mapbox;
