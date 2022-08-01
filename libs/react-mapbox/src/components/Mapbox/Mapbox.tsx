import React, {
  useEffect,
  useRef,
  createContext,
  useMemo,
  useCallback,
  useState,
  RefObject,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  useReducer,
} from "react";
import { Sources, MapIcon, Viewport, PartialViewport } from "../../types";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";
import { usePrevious } from "@bratislava/utils";
import { log } from "../../utils/log";
import { DevelopmentInfo } from "../DevelopmentInfo/DevelopmentInfo";
import {
  mergeViewports,
  ViewportActionKind,
  viewportReducer,
} from "./viewportReducer";
import "mapbox-gl/dist/mapbox-gl.css";
import { Feature } from "geojson";

export interface MapboxProps {
  mapboxgl: typeof mapboxgl;
  sources: Sources;
  isDarkmode?: boolean;
  isSatellite?: boolean;
  icons?: {
    [index: string]: string | MapIcon;
  };
  mapStyles: {
    light?: string;
    dark?: string;
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
}

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
  changeViewport: (viewport: PartialViewport, instant?: boolean) => void;
  layerPrefix: string;
}

const createMap = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapboxgl: any,
  mapContainer: RefObject<HTMLDivElement>,
  viewport: PartialViewport,
  isSatellite: boolean,
  isDarkmode: boolean,
  darkStyle: string,
  lightStyle: string
) => {
  return new mapboxgl.Map({
    pitchWithRotate: false,
    touchPitch: false,
    container: mapContainer.current ?? "",
    style: isDarkmode ? darkStyle : lightStyle,
    center: [
      viewport.center?.lng ?? 17.107748,
      viewport.center?.lat ?? 48.148598,
    ],
    zoom: viewport.zoom ?? 13,
    pitch: viewport.pitch ?? 0,
    bearing: viewport.bearing ?? 0,
    maxZoom: 20,
    minZoom: 10.75,
  });
};

export const mapboxContext = createContext<IContext>({
  map: null,
  isLoading: true,
  isStyleLoading: true,
  getPrefixedLayer: () => "",
  isLayerPrefixed: () => false,
  addClickableLayer: () => void 0,
  changeViewport: () => void 0,
  layerPrefix: "",
});

export type MapboxHandle = {
  changeViewport: (viewport: PartialViewport, instant?: boolean) => void;
  fitBounds: (
    bounds: mapboxgl.LngLatBoundsLike,
    options?: mapboxgl.FitBoundsOptions
  ) => void;
};

export const Mapbox = forwardRef<MapboxHandle, MapboxProps>(
  (
    {
      sources,
      icons = {},
      isDarkmode = false,
      isSatellite = false,
      selectedFeatures = [],
      mapStyles: {
        light: lightStyle = "mapbox://styles/mapbox/streets-v11",
        dark: darkStyle = "mapbox://styles/mapbox/streets-v11",
      },
      onFeaturesClick = () => void 0,
      mapboxgl,
      children,
      layerPrefix = "BRATISLAVA",
      onViewportChange,
      onViewportChangeDebounced,
      initialViewport: inputInitialViewport,
      isDevelopment = false,
      onLoad = () => void 0,
      onClick,
    },
    forwardedRef
  ) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const isMounted = useRef(false);

    const [clickableLayerIds, setClickableLayerIds] = useState<string[]>([]);

    const addClickableLayer = useCallback(
      (layerId: string) => {
        setClickableLayerIds((clickableLayerIds) => [
          ...clickableLayerIds,
          layerId,
        ]);
      },
      [setClickableLayerIds]
    );

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

    const [viewport, dispatchViewport] = useReducer(
      viewportReducer,
      initialViewport
    );

    const [debouncedViewport, dispatchDebouncedViewport] = useReducer(
      viewportReducer,
      initialViewport
    );

    const fitBounds = useCallback(
      (
        bounds: mapboxgl.LngLatBoundsLike,
        options?: mapboxgl.FitBoundsOptions
      ) => {
        const MAP = map.current;
        if (!MAP) return;
        MAP.fitBounds(bounds, options);
      },
      []
    );

    const changeViewport = useCallback(
      (partialViewport: PartialViewport, instant = false) => {
        const MAP = map.current;
        if (!MAP) return;

        dispatchDebouncedViewport({
          type: ViewportActionKind.Change,
          partialViewport: partialViewport,
        });

        const newViewport = mergeViewports(debouncedViewport, partialViewport);

        if (JSON.stringify(debouncedViewport) !== JSON.stringify(newViewport)) {
          if (instant) {
            MAP.jumpTo({
              ...newViewport,
            });
          } else {
            MAP.easeTo({
              ...newViewport,
            });
          }
        }
      },
      [debouncedViewport]
    );

    const [isLoading, setLoading] = useState(true);
    const [isStyleLoading, setStyleLoading] = useState(false);

    const previousMap = usePrevious(map);
    const previousLoading = usePrevious(isLoading);
    const previousDarkmode = usePrevious(isDarkmode);
    const previousSatellite = usePrevious(isSatellite);
    const prevSelectedFeatures = usePrevious(selectedFeatures);
    const prevClickableLayerIds = usePrevious(clickableLayerIds);

    // CREATE NEW LAYER ID BY ADDING PREFIX
    const getPrefixedLayer = useCallback(
      (id: string) => `${layerPrefix}-${id}`,
      [layerPrefix]
    );

    // CHECK IF LAYER ID CONTAINS PREFIX
    const isLayerPrefixed = useCallback(
      (id: string) => id.startsWith(layerPrefix),
      [layerPrefix]
    );

    useEffect(() => {
      if (isLoading === false && previousLoading === true) {
        onLoad();
        log("MAP LOADED");
      }
    }, [isLoading, onLoad, previousLoading]);

    // CONTEXT VALUE PASSED TO ALL CHILDRENS
    const mapContextValue: IContext = useMemo(
      () => ({
        map: map?.current,
        isLoading: isLoading,
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
      ]
    );

    // CREATING MAP
    useEffect(() => {
      setLoading(true);
      if (map.current) {
        log("REMOVING MAP");
        map.current.remove();
      }
      log("CREATING MAP");
      map.current = createMap(
        mapboxgl,
        mapContainer,
        viewport,
        isSatellite,
        isDarkmode,
        darkStyle,
        lightStyle
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setLoading]);

    // LOADING SOURCES
    const loadSources = useCallback(() => {
      if (!map.current) return;
      const MAP = map.current;
      log("LOADING SOURCES");
      Object.keys(sources).forEach((sourceKey) => {
        if (!MAP.getSource(sourceKey)) {
          MAP.addSource(sourceKey, {
            type: "geojson",
            data: sources[sourceKey],
            tolerance: 0,
          });
        }
      });

      if (!MAP.getSource("satellite")) {
        MAP.addSource("satellite", {
          type: "raster",
          tileSize: 256,
          tiles: [
            "https://geoportal.bratislava.sk/hsite/rest/services/Hosted/Ortofoto_2021_WGS/MapServer/tile/{z}/{y}/{x}",
          ],
        });
      }
    }, [sources]);

    // LOADING ICONS
    const loadIcons = useCallback(() => {
      if (!map.current) return;
      const MAP = map.current;

      log("LOADING ICONS");
      Object.keys(icons).forEach(async (key) => {
        const icon = icons[key];
        if (typeof icon === "string") {
          MAP.loadImage(icon, (error, image) => {
            if (!image) return;
            if (error) throw error;
            if (!MAP.hasImage(key)) {
              MAP.addImage(key, image);
            }
          });
        } else {
          const image = new Image(icon.width, icon.height);
          image.src = icon.path;
          if (!MAP.hasImage(key)) {
            image.onload = () => MAP.addImage(key, image);
          }
        }
      });
    }, [icons]);

    // MAP CLICK HANDLER
    const onMapClick = useCallback(
      (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        onClick && onClick(event);

        if (!map.current) return;
        const MAP = map.current;

        if (!clickableLayerIds.length) return;

        if (!event._defaultPrevented) {
          event.preventDefault();

          const features = MAP.queryRenderedFeatures(event.point);

          // filter only features from sources and from custom layers
          const filteredFeatures = features.reduce(
            (filteredFeatures, feature) => {
              if (
                // if source of the feature exists in sources
                (Object.keys(sources).find(
                  (sourceKey) => sourceKey === feature.source
                ) ||
                  // or layer id starts with prefix (custom layers from mapbox)
                  feature.layer.id.startsWith(layerPrefix)) &&
                // if feature from that source is not included already
                !filteredFeatures.find(
                  (filteredFeaturs) => filteredFeaturs.source === feature.source
                ) &&
                // is clickable
                clickableLayerIds.find(
                  (clickableLayerId) => clickableLayerId === feature.layer.id
                )
              ) {
                return [...filteredFeatures, feature];
              }
              return filteredFeatures;
            },
            [] as MapboxGeoJSONFeature[]
          );

          // if there is a symbol feature, ignore others
          const foundSymbolFeature = filteredFeatures.find((feature) => {
            return feature.layer.type === "symbol";
          });

          if (foundSymbolFeature) {
            onFeaturesClick([foundSymbolFeature]);
          } else {
            /*
              Geometry objects in queried features in Mapbox are based on zoom level,
              so it is not precise enough.
              This will replace the queried geometry object with the source one.
            */
            const fixedFeatures = filteredFeatures.map((f) => ({
              ...f,
              geometry: sources[f.source].features.find(
                (sf: Feature) => sf.id === f.id
              ).geometry,
            }));

            fixedFeatures.length && onFeaturesClick(fixedFeatures);
          }
        }
      },
      [layerPrefix, onFeaturesClick, sources, clickableLayerIds, onClick]
    );

    // MAP MOVE HANDLER
    const onMapMove = useCallback(() => {
      const MAP = map.current;
      if (!MAP) return;

      const center = MAP.getCenter();
      const zoom = MAP.getZoom();
      const pitch = MAP.getPitch();
      const bearing = MAP.getBearing();
      const padding = MAP.getPadding();

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
      const MAP = map.current;
      if (!MAP) return;

      const center = MAP.getCenter();
      const zoom = MAP.getZoom();
      const pitch = MAP.getPitch();
      const bearing = MAP.getBearing();
      const padding = MAP.getPadding();

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

      dispatchDebouncedViewport({
        type: ViewportActionKind.Change,
        partialViewport: viewport,
      });
    }, []);

    // REGISTER MAP LAYER EVENT CALLBACKS
    const registerMapLayerEvents = useCallback(
      (customLayer: mapboxgl.Layer) => {
        if (!map.current) return;
        const MAP = map.current;

        let hoveredFeatureId: string | number | undefined = undefined;
        MAP.on("mousemove", customLayer.id, (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];

            // if same feature is hovered
            if (hoveredFeatureId === feature.id) {
              return;
            }
            // if something was else was hovered then disable it
            else if (hoveredFeatureId !== undefined) {
              MAP.setFeatureState(
                {
                  source: feature.source,
                  id: hoveredFeatureId,
                  sourceLayer: customLayer["source-layer"],
                },
                { hover: false }
              );
            }
            // set hovered feature
            MAP.setFeatureState(
              {
                source: feature.source,
                id: feature.id,
                sourceLayer: customLayer["source-layer"],
              },
              { hover: true }
            );
            hoveredFeatureId = feature.id;

            if (
              clickableLayerIds.find(
                (clickableLayerId) => clickableLayerId === feature.layer.id
              )
            ) {
              MAP.getCanvas().style.cursor = "pointer";
            }
          }
        });

        MAP.on("mouseleave", customLayer.id, () => {
          if (hoveredFeatureId !== undefined) {
            MAP.setFeatureState(
              {
                source: customLayer.source as string,
                id: hoveredFeatureId,
                sourceLayer: customLayer["source-layer"],
              },
              { hover: false }
            );
          }
          hoveredFeatureId = undefined;
          MAP.getCanvas().style.cursor = "default";
        });
      },
      [clickableLayerIds]
    );

    // REGISTER MAP EVENTS
    useEffect(() => {
      if (!map.current) return;
      const MAP = map.current;

      if (
        (!isLoading && previousLoading) ||
        (!isLoading &&
          JSON.stringify(prevClickableLayerIds) !==
            JSON.stringify(clickableLayerIds))
      ) {
        log("REGISTERING MAP EVENTS");

        // get custom layers (prefixed)
        const customLayers = MAP.getStyle().layers.reduce(
          (layers, layer: mapboxgl.Layer) => {
            if (
              isLayerPrefixed(layer.id) &&
              !layers.find((foundLayer) => foundLayer.source === layer.source)
            ) {
              return [...layers, layer];
            } else {
              return layers;
            }
          },
          [] as mapboxgl.Layer[]
        );

        customLayers.forEach((customLayer) => {
          registerMapLayerEvents(customLayer);
        });
      }

      MAP.on("move", onMapMove);
      MAP.on("moveend", onMapMoveEnd);
      MAP.on("click", onMapClick);

      return () => {
        MAP.off("move", onMapMove);
        MAP.off("moveend", onMapMoveEnd);
        MAP.off("click", onMapClick);
      };
    }, [
      previousLoading,
      isLoading,
      registerMapLayerEvents,
      isLayerPrefixed,
      onMapMove,
      onMapMoveEnd,
      onMapClick,
      clickableLayerIds,
      prevClickableLayerIds,
    ]);

    // ON MAP LOAD
    useEffect(() => {
      const MAP = map.current;
      if (!MAP || !isLoading) return;

      if (
        previousMap !== map ||
        previousDarkmode !== isDarkmode ||
        previousSatellite !== isSatellite
      ) {
        log("LOADING MAP");

        MAP.on("load", () => {
          MAP.resize();
          loadSources();
          loadIcons();
          setTimeout(() => setLoading(false), 1000);
        });
      }
    }, [
      previousMap,
      setLoading,
      isLoading,
      loadSources,
      loadIcons,
      isMounted,
      previousDarkmode,
      isDarkmode,
      previousSatellite,
      isSatellite,
    ]);

    // REACT TO SELECTED FEATURES STATE CHANGES
    useEffect(() => {
      if (!map.current) return;
      const MAP = map.current;

      // deselect previous selected features
      if (prevSelectedFeatures) {
        prevSelectedFeatures.forEach((feature) => {
          MAP.setFeatureState(
            {
              source: feature.source,
              id: feature.id,
              sourceLayer: feature.layer["source-layer"],
            },
            { selected: false }
          );
        });
      }

      // select the new selected features
      if (selectedFeatures) {
        selectedFeatures.forEach((feature) => {
          MAP.setFeatureState(
            {
              source: feature.source,
              id: feature.id,
              sourceLayer: feature.layer["source-layer"],
            },
            { selected: true }
          );
        });
      }
    }, [prevSelectedFeatures, selectedFeatures]);

    // STYLE CHANGING
    useEffect(() => {
      if (!map.current) return;
      const MAP = map.current;

      if (isDarkmode !== previousDarkmode) {
        log("SETTING NEW STYLE");
        MAP.setStyle(isDarkmode ? darkStyle : lightStyle);
        setStyleLoading(true);

        MAP.on("style.load", () => {
          loadSources();
          loadIcons();
          setStyleLoading(false);
          log("STYLE LOADED");

          if (isSatellite === true) {
            if (!MAP.getLayer("satellite-raster")) {
              const layers = MAP.getStyle().layers;
              const bottomLayer = layers.find((layer) =>
                layer.id.startsWith(layerPrefix)
              );
              MAP.addLayer(
                {
                  id: "satellite-raster",
                  type: "raster",
                  source: "satellite",
                },
                bottomLayer?.id
              );
            }
          }
        });
      }
    }, [
      isDarkmode,
      previousDarkmode,
      isSatellite,
      layerPrefix,
      darkStyle,
      lightStyle,
      loadSources,
      loadIcons,
      previousSatellite,
    ]);

    useEffect(() => {
      if (!map.current) return;
      const MAP = map.current;

      if (isDarkmode === previousDarkmode) {
        if (isSatellite === true) {
          if (!MAP.getLayer("satellite-raster")) {
            const layers = MAP.getStyle().layers;
            const bottomLayer = layers.find((layer) =>
              layer.id.startsWith(layerPrefix)
            );
            MAP.addLayer(
              {
                id: "satellite-raster",
                type: "raster",
                source: "satellite",
              },
              bottomLayer?.id
            );
          }
        } else {
          if (MAP.getLayer("satellite-raster")) {
            MAP.removeLayer("satellite-raster");
          }
        }
      }
    }, [isDarkmode, isSatellite, layerPrefix, previousDarkmode]);

    // EVENTS
    useEffect(() => {
      log("VIEWPORT CHANGE");
      onViewportChange && onViewportChange(viewport);
    }, [viewport, onViewportChange]);

    useEffect(() => {
      log("DEBOUNCED VIEWPORT CHANGE");
      onViewportChangeDebounced && onViewportChangeDebounced(debouncedViewport);
    }, [debouncedViewport, onViewportChangeDebounced]);

    // EXPOSING METHODS FOR PARENT COMPONENT
    useImperativeHandle(forwardedRef, () => ({
      changeViewport,
      fitBounds,
    }));

    return (
      <mapboxContext.Provider value={mapContextValue}>
        <div ref={mapContainer} className="w-full h-full bg-background" />
        {children}
        <DevelopmentInfo isDevelopment={isDevelopment} viewport={viewport} />
      </mapboxContext.Provider>
    );
  }
);

Mapbox.displayName = "Mapbox";

export default Mapbox;
