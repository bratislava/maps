import React, {
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useCallback,
  useState,
  RefObject,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";
import { Sources, MapIcon, IViewport, IPadding } from "../../types";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";
import { usePrevious } from "../../hooks/usePrevious";
import { log } from "../../utils/log";
import { createGeolocationMarkerElement } from "../../utils/createGeolocationMarkerElement";
import bbox from "@turf/bbox";
import DATA_DISTRICTS from "../../assets/layers/districts.json";
import { DevelopmentInfo } from "../DevelopmentInfo/DevelopmentInfo";

export interface MapboxProps {
  mapboxgl: typeof mapboxgl;
  sources: Sources;
  isDarkmode?: boolean;
  isSatellite?: boolean;
  isGeolocation?: boolean;
  icons?: {
    [index: string]: string | MapIcon;
  };
  mapStyles: {
    light?: string;
    dark?: string;
    satellite?: string;
  };
  selectedFeatures: any[];
  onFeatureClick: (features: any[]) => void;
  loadingState: [boolean, Dispatch<SetStateAction<boolean>>];
  children?: ReactNode;
  layerPrefix?: string;
  onViewportChange?: (viewport: IViewport) => void;
  onViewportChangeDebounced?: (viewport: IViewport) => void;
  onControlsMarginChange?: (margin: IPadding) => void;
  defaultCenter?: {
    lat: number;
    lng: number;
  };
  isDevelopment?: boolean;
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
  considerPadding: (value: ISlotPadding) => void;
  removePadding: (name: string) => void;
}

const createMap = (
  mapboxgl: any,
  mapContainer: RefObject<HTMLDivElement>,
  viewport: IViewport,
  isSatellite: boolean,
  satelliteStyle: string,
  isDarkmode: boolean,
  darkStyle: string,
  lightStyle: string
) => {
  return new mapboxgl.Map({
    pitchWithRotate: false,
    touchPitch: false,
    container: mapContainer.current ?? "",
    style: isSatellite ? satelliteStyle : isDarkmode ? darkStyle : lightStyle,
    center: [
      viewport.center.lng ?? 17.107748,
      viewport.center.lat ?? 48.148598,
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
  considerPadding: () => void 0,
  removePadding: () => void 0,
});

export type MapboxHandle = {
  fitToDistrict: (district: string | null) => void;
  viewport: IViewport;
  changeViewport: (viewport: Partial<IViewport>) => void;
};

export const Mapbox = forwardRef<MapboxHandle, MapboxProps>(
  (
    {
      loadingState,
      sources,
      icons = {},
      isDarkmode = false,
      isSatellite = false,
      isGeolocation = false,
      selectedFeatures,
      mapStyles: {
        light: lightStyle = "mapbox://styles/mapbox/streets-v11",
        dark: darkStyle = "mapbox://styles/mapbox/streets-v11",
        satellite: satelliteStyle = "mapbox://styles/mapbox/streets-v11",
      },
      onFeatureClick,
      mapboxgl,
      children,
      layerPrefix = "BRATISLAVA",
      onViewportChange = () => void 0,
      onViewportChangeDebounced = () => void 0,
      onControlsMarginChange = () => void 0,
      defaultCenter,
      isDevelopment = false,
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

    const [centerLng, setCenterLng] = useState(defaultCenter?.lng ?? 0);
    const [centerLat, setCenterLat] = useState(defaultCenter?.lat ?? 0);
    const [zoom, setZoom] = useState(0);
    const [bearing, setBearing] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [paddingTop, setPaddingTop] = useState(0);
    const [paddingRight, setPaddingRight] = useState(0);
    const [paddingBottom, setPaddingBottom] = useState(0);
    const [paddingLeft, setPaddingLeft] = useState(0);

    const [controlsMarginTop, setControlsMarginTop] = useState(0);
    const [controlsMarginRight, setControlsMarginRight] = useState(0);
    const [controlsMarginBottom, setControlsMarginBottom] = useState(0);
    const [controlsMarginLeft, setControlsMarginLeft] = useState(0);

    const [slotsPaddings, setSlotsPaddings] = useState<ISlotPadding[]>([]);

    const considerPadding = useCallback(
      (paddingToConsider: ISlotPadding) => {
        log(`CONSIDERING PADDING: ${paddingToConsider.name}`);
        setSlotsPaddings((slotsPaddings) => {
          const filteredSlotsPaddigs = slotsPaddings.filter(
            (slotPadding) => slotPadding.name != paddingToConsider.name
          );
          filteredSlotsPaddigs.push(paddingToConsider);
          return filteredSlotsPaddigs;
        });
      },
      [setSlotsPaddings]
    );

    const removePadding = useCallback(
      (name: string) => {
        log(`REMOVING PADDING: ${name}`);
        setSlotsPaddings((slotsPaddings) => {
          return slotsPaddings.filter(
            (slotPadding) => slotPadding.name != name
          );
        });
      },
      [setSlotsPaddings]
    );

    useEffect(() => {
      onControlsMarginChange({
        top: controlsMarginTop,
        right: controlsMarginRight,
        bottom: controlsMarginBottom,
        left: controlsMarginLeft,
      });
    }, [
      controlsMarginTop,
      controlsMarginRight,
      controlsMarginBottom,
      controlsMarginLeft,
    ]);

    useEffect(() => {
      log("PADDINGS CHANGED");
      const visibleSlotPaddings = slotsPaddings.filter((s) => s.isVisible);
      const paddingTop = Math.max(
        0,
        ...visibleSlotPaddings.map((s) => s.padding.top ?? 0)
      );
      const paddingRight = Math.max(
        0,
        ...visibleSlotPaddings.map((s) => s.padding.right ?? 0)
      );
      const paddingBottom = Math.max(
        0,
        ...visibleSlotPaddings.map((s) => s.padding.bottom ?? 0)
      );
      const paddingLeft = Math.max(
        0,
        ...visibleSlotPaddings.map((s) => s.padding.left ?? 0)
      );

      setControlsMarginTop(
        Math.max(
          0,
          ...visibleSlotPaddings
            .filter((s) => s.avoidControls)
            .map((s) => s.padding.top ?? 0)
        )
      );
      setControlsMarginRight(
        Math.max(
          0,
          ...visibleSlotPaddings
            .filter((s) => s.avoidControls)
            .map((s) => s.padding.right ?? 0)
        )
      );
      setControlsMarginBottom(
        Math.max(
          0,
          ...visibleSlotPaddings
            .filter((s) => s.avoidControls)
            .map((s) => s.padding.bottom ?? 0)
        )
      );
      setControlsMarginLeft(
        Math.max(
          0,
          ...visibleSlotPaddings
            .filter((s) => s.avoidControls)
            .map((s) => s.padding.left ?? 0)
        )
      );
      changeViewport({
        padding: {
          top: paddingTop,
          right: paddingRight,
          bottom: paddingBottom,
          left: paddingLeft,
        },
      });
    }, [slotsPaddings]);

    const padding = useMemo(() => {
      return {
        top: paddingTop,
        right: paddingRight,
        bottom: paddingBottom,
        left: paddingLeft,
      };
    }, [paddingTop, paddingRight, paddingBottom, paddingLeft]);

    const center = useMemo(() => {
      return {
        lng: centerLng,
        lat: centerLat,
      };
    }, [centerLng, centerLat]);

    const viewport = useMemo(() => {
      return {
        center,
        zoom,
        bearing,
        pitch,
        padding,
      };
    }, [center, zoom, bearing, pitch, padding]);

    const changeViewport = useCallback(
      (newViewport: Partial<IViewport>) => {
        const MAP = map.current;
        if (!MAP) return;

        log("CHANGE VIEWPORT");

        onViewportChangeDebounced({ ...viewport, ...newViewport });
        MAP.flyTo({
          ...viewport,
          ...newViewport,
          maxDuration: 5000,
        });
      },
      [map, onViewportChange, viewport]
    );

    const [isLoading, setLoading] = loadingState;
    const [isStyleLoading, setStyleLoading] = useState(false);
    const [geolocationMarker, setGeolocationMarker] =
      useState<mapboxgl.Marker | null>(null);

    const previousMap = usePrevious(map);
    const previousLoading = usePrevious(isLoading);
    const previousDarkmode = usePrevious(isDarkmode);
    const previousSatellite = usePrevious(isSatellite);
    const previousGeolocation = usePrevious(isGeolocation);
    const prevSelectedFeatures = usePrevious(selectedFeatures);
    const prevClickableLayerIds = usePrevious(clickableLayerIds);

    //CREATE NEW LAYER ID BY ADDING PREFIX
    const getPrefixedLayer = useCallback(
      (id: string) => `${layerPrefix}-${id}`,
      [layerPrefix]
    );

    //CHECK IF LAYER ID CONTAINS PREFIX
    const isLayerPrefixed = useCallback(
      (id: string) => id.startsWith(layerPrefix),
      [layerPrefix]
    );

    //CONTEXT VALUE PASSED TO ALL CHILDRENS
    const mapContextValue: IContext = useMemo(
      () => ({
        map: map?.current,
        isLoading: isLoading,
        getPrefixedLayer,
        isStyleLoading,
        isLayerPrefixed,
        addClickableLayer,
        considerPadding,
        removePadding,
      }),
      [
        map,
        isLoading,
        getPrefixedLayer,
        isStyleLoading,
        isLayerPrefixed,
        addClickableLayer,
        considerPadding,
        removePadding,
      ]
    );

    //GEOLOCATION TOGGLING
    useEffect(() => {
      const MAP = map.current;
      if (!MAP || isLoading) return;

      if (isGeolocation !== previousGeolocation) {
        if (isGeolocation) {
          log("GEOLOCATION TURNED ON");
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                log("ADDING GEOLOCATION MARKER");
                setGeolocationMarker(
                  new mapboxgl.Marker(createGeolocationMarkerElement())
                    .setLngLat([
                      position.coords.longitude,
                      position.coords.latitude,
                    ])
                    .addTo(MAP)
                );
                setCenterLat(position.coords.latitude);
                setCenterLng(position.coords.longitude);
              },
              (error) => {
                alert(error.message);
              }
            );
          } else {
            alert("Your device does not support Geolocation");
          }
        } else {
          log("GEOLOCATION TURNED OFF");
          if (geolocationMarker) {
            log("REMOVING GEOLOCATION MARKER");
            geolocationMarker.remove();
            setGeolocationMarker(null);
          }
        }
      }
    }, [
      geolocationMarker,
      isGeolocation,
      previousGeolocation,
      isLoading,
      mapboxgl,
      setCenterLat,
      setCenterLng,
      viewport,
    ]);

    //CREATING MAP
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
        satelliteStyle,
        isDarkmode,
        darkStyle,
        lightStyle
      );
    }, [setLoading]);

    //LOADING SOURCES
    const loadSources = useCallback(() => {
      if (!map.current) return;
      const MAP = map.current;
      log("LOADING SOURCES");
      Object.keys(sources).forEach((sourceKey) => {
        if (!MAP.getSource(sourceKey)) {
          MAP.addSource(sourceKey, {
            type: "geojson",
            data: sources[sourceKey],
          });
        }
      });
    }, [sources]);

    //LOADING ICONS
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

    //MAP CLICK HANDLER
    const onMapClick = useCallback(
      (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        if (!map.current) return;
        const MAP = map.current;

        if (!clickableLayerIds.length) return;

        if (!event._defaultPrevented) {
          event.preventDefault();

          const features = MAP.queryRenderedFeatures(event.point);

          //filter only features from sources and from custom layers
          const filteredFeatures = features.reduce(
            (filteredFeatures, feature) => {
              if (
                //if source of the feature exists in sources
                (Object.keys(sources).find(
                  (sourceKey) => sourceKey === feature.source
                ) ||
                  //or layer id starts with prefix (custom layers from mapbox)
                  feature.layer.id.startsWith(layerPrefix)) &&
                //if feature from that source is not included already
                !filteredFeatures.find(
                  (filteredFeaturs) => filteredFeaturs.source === feature.source
                ) &&
                //is clickable
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

          //if there is a symbol feature, ignore others
          const foundSymbolFeature = filteredFeatures.find((feature) => {
            return feature.layer.type === "symbol";
          });

          if (foundSymbolFeature) {
            onFeatureClick([foundSymbolFeature]);
          } else {
            onFeatureClick(filteredFeatures);
          }
        }
      },
      [layerPrefix, onFeatureClick, sources, clickableLayerIds]
    );

    //MAP MOVE HANDLER
    const onMapMove = useCallback(() => {
      const MAP = map.current;
      if (!MAP) return;

      const center = MAP.getCenter();
      const zoom = MAP.getZoom();
      const pitch = MAP.getPitch();
      const bearing = MAP.getBearing();
      const padding = MAP.getPadding();

      setCenterLat(center.lat);
      setCenterLng(center.lng);
      setZoom(zoom);
      setPitch(pitch);
      setBearing(bearing);
      setPaddingTop(padding.top);
      setPaddingRight(padding.right);
      setPaddingBottom(padding.bottom);
      setPaddingLeft(padding.left);

      onViewportChange({
        center: {
          lat: center.lat,
          lng: center.lng,
        },
        zoom,
        bearing,
        pitch,
        padding: {
          top: padding.top,
          right: padding.right,
          bottom: padding.bottom,
          left: padding.left,
        },
      });
    }, [onViewportChange]);

    //MAP MOVEEND HANDLER
    const onMapMoveEnd = useCallback(() => {
      const MAP = map.current;
      if (!MAP) return;
    }, [setCenterLat, setCenterLng, setZoom, setPitch, setBearing]);

    //REGISTER MAP LAYER EVENT CALLBACKS
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

        MAP.on("mouseleave", customLayer.id, (e) => {
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

    //REGISTER MAP EVENTS
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

        //get custom layers (prefixed)
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

    //ON MAP LOAD
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
          setLoading(false);
          log("MAP LOADED");
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

    //REACT TO SELECTED FEATURES STATE CHANGES
    useEffect(() => {
      if (!map.current) return;
      const MAP = map.current;

      //deselect previous selected features
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

      //select the new selected features
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

      if (
        isSatellite !== previousSatellite ||
        (!isSatellite && isDarkmode !== previousDarkmode)
      ) {
        log("SETTING NEW STYLE");
        MAP.setStyle(
          isSatellite ? satelliteStyle : isDarkmode ? darkStyle : lightStyle
        );
        setStyleLoading(true);

        MAP.on("style.load", () => {
          loadSources();
          loadIcons();
          setStyleLoading(false);
          log("STYLE LOADED");
        });
      }
    }, [
      isDarkmode,
      previousDarkmode,
      isSatellite,
      previousSatellite,
      satelliteStyle,
      darkStyle,
      lightStyle,
      loadSources,
      loadIcons,
    ]);

    //EXPOSING METHODS FOR PARENT COMPONENT
    useImperativeHandle(forwardedRef, () => ({
      viewport,

      changeViewport,

      fitToDistrict(district) {
        if (!map.current) return;
        const MAP = map.current;

        log("FITTING TO DISTRICT");

        const districtFeature = DATA_DISTRICTS.features.find(
          (feature) => feature.properties.name === district
        );

        if (!districtFeature) return;

        const boundingBox = bbox(districtFeature) as [
          number,
          number,
          number,
          number
        ];

        MAP.fitBounds(boundingBox, { padding: 128 });
      },
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
