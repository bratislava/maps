import {
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  ReactElement,
  createContext,
  useMemo,
  useCallback,
  useState,
  MutableRefObject,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Sources, IViewportProps, MapIcon } from "../types";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { ILayerProps } from "./Layer";
import { usePrevious } from "../hooks/usePrevious";
import { log } from "../utils/log";
import { createGeolocationMarkerElement } from "../utils/createGeolocationMarkerElement";
import bbox from "@turf/bbox";
import DATA_DISTRICTS from "../assets/layers/districts.json";

export interface MapboxProps {
  mapboxgl: typeof mapboxgl;
  sources: Sources;
  isDarkmode: boolean;
  satelliteState: [boolean, Dispatch<SetStateAction<boolean>>];
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
  viewportState: [IViewportProps, Dispatch<SetStateAction<IViewportProps>>];
  children?: ReactElement<ILayerProps> | Array<ReactElement<ILayerProps>>;
  layerPrefix?: string;
  onBearingChange?: (bearing: number) => void;
  geolocationState: [boolean, Dispatch<SetStateAction<boolean>>];
  selectedDistrict: string | null;
  districtFiltering?: boolean;
}

export interface IContext {
  map: mapboxgl.Map;
  isLoading: boolean;
  getPrefixedLayer: (layerId: string) => string;
  isLayerPrefixed: (layerId: string) => boolean;
  addClickableLayer: (layerId: string) => void;
  districtFiltering: boolean;
}

const createMap = (
  mapboxgl: any,
  mapContainer: MutableRefObject<HTMLDivElement>,
  viewport: IViewportProps,
  isSatellite: boolean,
  satelliteStyle: string,
  isDarkmode: boolean,
  darkStyle: string,
  lightStyle: string
) => {
  return new mapboxgl.Map({
    pitchWithRotate: false,
    touchPitch: false,
    container: mapContainer.current || "",
    style: isSatellite ? satelliteStyle : isDarkmode ? darkStyle : lightStyle,
    center: [viewport.lng || 17.107748, viewport.lat || 48.148598],
    zoom: viewport.zoom || 13,
    pitch: viewport.pitch || 0,
    bearing: viewport.bearing || 0,
    maxZoom: 20,
    minZoom: 10.75,
  });
};

export const mapContext = createContext<IContext>(null);

type MapboxHandle = {
  fitToDisplayedData: () => void;
  fitToDistrict: (district: string | null) => void;
};

export const Mapbox = forwardRef<MapboxHandle, MapboxProps>(
  (
    {
      loadingState,
      sources,
      icons = {},
      isDarkmode,
      satelliteState,
      selectedFeatures,
      mapStyles: {
        light: lightStyle = "mapbox://styles/mapbox/streets-v11",
        dark: darkStyle = "mapbox://styles/mapbox/streets-v11",
        satellite: satelliteStyle = "mapbox://styles/mapbox/streets-v11",
      },
      onFeatureClick,
      viewportState,
      mapboxgl,
      children,
      geolocationState,
      layerPrefix = "BRATISLAVA",
      onBearingChange,
      districtFiltering = true,
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

    const [viewport, setViewport] = viewportState;
    const [isLoading, setLoading] = loadingState;
    const [isGeolocation, setGeolocation] = geolocationState;
    const [isSatellite, setSatellite] = satelliteState;
    const [isReloadingLayers, setReloadingLayers] = useState(false);
    const [geolocationMarker, setGeolocationMarker] =
      useState<mapboxgl.Marker>(null);

    const previousMap = usePrevious(map);
    const previousLoading = usePrevious(isLoading);
    const previousDarkmode = usePrevious(isDarkmode);
    const previousSatellite = usePrevious(isSatellite);
    const previousGeolocation = usePrevious(isGeolocation);
    const previousViewport = usePrevious(viewport);
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
        isLayerPrefixed,
        addClickableLayer,
        districtFiltering,
      }),
      [
        map,
        isLoading,
        getPrefixedLayer,
        isLayerPrefixed,
        addClickableLayer,
        districtFiltering,
      ]
    );

    //GEOLOCATION TOGGLING
    useEffect(() => {
      if (!map.current && isLoading) return;
      const MAP = map.current;
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
                setViewport({
                  ...viewport,
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
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
      setViewport,
      viewport,
    ]);

    //CREATING MAP
    useEffect(() => {
      setLoading(true);
      //if map exists then remove it
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
            []
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
    const onMapMove = useCallback(
      (
        event: mapboxgl.MapboxEvent<MouseEvent | TouchEvent | WheelEvent> &
          mapboxgl.EventData
      ) => {
        if (!map.current) return;
        const MAP = map.current;
        onBearingChange(MAP.getBearing());
      },
      [onBearingChange]
    );

    //MAP MOVEEND HANDLER
    const onMapMoveEnd = useCallback(() => {
      if (!map.current) return;
      const MAP = map.current;
      const center = MAP.getCenter();
      setViewport({
        lat: center.lat,
        lng: center.lng,
        zoom: MAP.getZoom(),
        pitch: MAP.getPitch(),
        bearing: MAP.getBearing(),
        paddingLeft: MAP.getPadding().left,
        paddingRight: MAP.getPadding().right,
        paddingBottom: MAP.getPadding().bottom,
      });
    }, [setViewport]);

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
      if (!map.current) return () => null;
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
      if (!map.current && !isLoading) return;
      const MAP = map.current;

      //disable satellite when darkmode changes
      if (previousDarkmode !== isDarkmode) setSatellite(false);

      if (
        previousMap !== map ||
        previousDarkmode !== isDarkmode ||
        previousSatellite !== isSatellite
      ) {
        log("LOADING MAP");
        setReloadingLayers(true);

        MAP.on("load", () => {
          MAP.resize();
          loadSources();
          loadIcons();
          setReloadingLayers(false);
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
      setSatellite,
    ]);

    //SET PADDING ON LOAD
    //because for some reason padding is not as available parameter in createMap
    useEffect(() => {
      if (!map.current) return;
      const MAP = map.current;
      if (previousLoading && !isLoading) {
        MAP.jumpTo({
          padding: {
            top: 0,
            left: viewport.paddingLeft,
            right: viewport.paddingRight,
            bottom: viewport.paddingBottom,
          },
        });
      }
    }, [previousLoading, isLoading, viewport]);

    //REACT TO VIEWPORT STATE CHANGES
    useEffect(() => {
      if (!map.current) return;
      const MAP = map.current;

      if (JSON.stringify(previousViewport) !== JSON.stringify(viewport)) {
        log("VIEWPORT CHANGED");

        const center = MAP.getCenter();
        const zoom = MAP.getZoom();
        const bearing = MAP.getBearing();
        const pitch = MAP.getPitch();
        const padding = MAP.getPadding();

        if (
          center.lat !== viewport.lat ||
          center.lng !== viewport.lng ||
          zoom !== viewport.zoom ||
          bearing !== viewport.bearing ||
          pitch !== viewport.pitch ||
          padding.left !== viewport.paddingLeft ||
          padding.right !== viewport.paddingRight ||
          padding.bottom !== viewport.paddingBottom
        ) {
          if (!MAP.isEasing()) {
            MAP.flyTo({
              center: [viewport.lng || 0, viewport.lat || 0],
              zoom: viewport.zoom,
              bearing: viewport.bearing,
              pitch: viewport.pitch,
              padding: {
                top: 0,
                left: viewport.paddingLeft,
                right: viewport.paddingRight,
                bottom: viewport.paddingBottom,
              },
              maxDuration: 5000,
            });
          }
        }
      }
    }, [previousViewport, viewport]);

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

        MAP.on("style.load", () => {
          loadSources();
          loadIcons();
          setReloadingLayers(false);
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

    const fitToDisplayedData = useCallback(() => {
      if (!map.current && !isLoading) return;
      const MAP = map.current;

      log("FITTING TO DISPLAYED DATA");
    }, [map, isLoading]);

    //EXPOSING METHODS FOR PARENT COMPONENT
    useImperativeHandle(
      forwardedRef,
      () => ({
        fitToDisplayedData,
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
      }),
      [fitToDisplayedData]
    );

    return (
      <mapContext.Provider value={mapContextValue}>
        <div ref={mapContainer} className="w-full h-full bg-background" />
        {isReloadingLayers ? null : children}
      </mapContext.Provider>
    );
  }
);

export default Mapbox;
