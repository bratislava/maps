"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Mapbox = exports.mapboxContext = void 0;
var utils_1 = require("@bratislava/utils");
var mapbox_gl_1 = require("mapbox-gl");
require("mapbox-gl/dist/mapbox-gl.css");
var react_1 = require("react");
var usehooks_ts_1 = require("usehooks-ts");
var constants_1 = require("../../utils/constants");
var DevelopmentInfo_1 = require("../DevelopmentInfo/DevelopmentInfo");
var viewportReducer_1 = require("./viewportReducer");
;
exports.mapboxContext = (0, react_1.createContext)({
    map: null,
    isLoading: true,
    isStyleLoading: true,
    getPrefixedLayer: function () { return ''; },
    isLayerPrefixed: function () { return false; },
    addClickableLayer: function () { return void 0; },
    changeViewport: function () { return void 0; },
    layerPrefix: ''
});
exports.Mapbox = (0, react_1.forwardRef)(function (_a, forwardedRef) {
    var _b = _a.isDarkmode, isDarkmode = _b === void 0 ? false : _b, _c = _a.isSatellite, isSatellite = _c === void 0 ? false : _c, selectedFeatures = _a.selectedFeatures, mapStyles = _a.mapStyles, onFeaturesClick = _a.onFeaturesClick, mapboxAccessToken = _a.mapboxAccessToken, children = _a.children, _d = _a.layerPrefix, layerPrefix = _d === void 0 ? 'BRATISLAVA' : _d, onViewportChange = _a.onViewportChange, onViewportChangeDebounced = _a.onViewportChangeDebounced, inputInitialViewport = _a.initialViewport, _e = _a.isDevelopment, isDevelopment = _e === void 0 ? false : _e, onLoad = _a.onLoad, onClick = _a.onClick, _f = _a.disableBearing, disableBearing = _f === void 0 ? false : _f, _g = _a.disablePitch, disablePitch = _g === void 0 ? true : _g, maxBounds = _a.maxBounds, _h = _a.maxZoom, maxZoom = _h === void 0 ? 30 : _h, _j = _a.minZoom, minZoom = _j === void 0 ? 10.8 : _j, locale = _a.locale, _k = _a.cooperativeGestures, cooperativeGestures = _k === void 0 ? false : _k, _l = _a.interactive, interactive = _l === void 0 ? true : _l;
    var mapContainerId = (0, react_1.useId)();
    var _m = (0, react_1.useState)(null), map = _m[0], setMap = _m[1];
    (0, react_1.useEffect)(function () {
        if (!map)
            return;
        map.setMaxZoom(maxZoom);
        map.setMinZoom(minZoom);
    }, [maxZoom, minZoom]);
    var _o = (0, react_1.useState)([]), clickableLayerIds = _o[0], setClickableLayerIds = _o[1];
    var addClickableLayer = (0, react_1.useCallback)(function (layerId) {
        setClickableLayerIds(function (clickableLayerIds) { return __spreadArray(__spreadArray([], clickableLayerIds, true), [
            layerId,
        ], false); });
    }, [setClickableLayerIds]);
    var initialViewport = (0, react_1.useState)((0, viewportReducer_1.mergeViewports)(constants_1.defaultInitialViewport, inputInitialViewport !== null && inputInitialViewport !== void 0 ? inputInitialViewport : {}))[0];
    // Viewport where map is going
    var _p = (0, react_1.useReducer)(viewportReducer_1.viewportReducer, initialViewport), futureViewport = _p[0], dispatchFutureViewport = _p[1];
    // Current viewport
    var _q = (0, react_1.useReducer)(viewportReducer_1.viewportReducer, initialViewport), viewport = _q[0], dispatchViewport = _q[1];
    // Debounced current viewport
    var debouncedViewport = (0, usehooks_ts_1.useDebounce)(viewport, 100);
    (0, react_1.useEffect)(function () {
        dispatchFutureViewport({
            type: viewportReducer_1.ViewportActionKind.Change,
            partialViewport: debouncedViewport
        });
    }, [debouncedViewport]);
    var fitBounds = (0, react_1.useCallback)(function (bounds, options) {
        if (!map)
            return;
        map.fitBounds(bounds, options);
    }, [map]);
    var _r = (0, react_1.useState)({}), futurePartialViewport = _r[0], setFuturePartialViewport = _r[1];
    var changeViewport = (0, react_1.useCallback)(function (partialViewport, duration) {
        if (duration === void 0) { duration = 500; }
        var newFuturePartialViewport = (0, viewportReducer_1.mergePartialViewports)(futurePartialViewport !== null && futurePartialViewport !== void 0 ? futurePartialViewport : {}, partialViewport);
        if (!(0, viewportReducer_1.areViewportsSame)(futurePartialViewport, newFuturePartialViewport)) {
            setFuturePartialViewport(newFuturePartialViewport);
        }
    }, [futurePartialViewport]);
    (0, react_1.useEffect)(function () {
        if (!map)
            return;
        var center = map.getCenter();
        var zoom = map.getZoom();
        var pitch = map.getPitch();
        var bearing = map.getBearing();
        var padding = map.getPadding();
        var currentViewport = {
            center: center,
            zoom: zoom,
            pitch: pitch,
            bearing: bearing,
            padding: padding
        };
        var futureViewport = (0, viewportReducer_1.mergeViewports)(currentViewport, futurePartialViewport);
        var timer = setTimeout(function () {
            if (!(0, viewportReducer_1.areViewportsSame)(currentViewport, futureViewport)) {
                setFuturePartialViewport({});
                map === null || map === void 0 ? void 0 : map.easeTo(futureViewport);
            }
        }, 50);
        return function () {
            clearTimeout(timer);
        };
    }, [changeViewport, futurePartialViewport, map]);
    var _s = (0, react_1.useState)(true), isLoading = _s[0], setLoading = _s[1];
    var _t = (0, react_1.useState)(false), isStyleLoading = _t[0], setStyleLoading = _t[1];
    var previousLoading = (0, utils_1.usePrevious)(isLoading);
    var prevSelectedFeatures = (0, utils_1.usePrevious)(selectedFeatures);
    var prevClickableLayerIds = (0, utils_1.usePrevious)(clickableLayerIds);
    // CREATE NEW LAYER ID BY ADDING PREFIX
    var getPrefixedLayer = (0, react_1.useCallback)(function (id) { return "".concat(layerPrefix, "-").concat(id); }, [layerPrefix]);
    // CHECK IF LAYER ID CONTAINS PREFIX
    var isLayerPrefixed = (0, react_1.useCallback)(function (id) { return id.startsWith(layerPrefix); }, [layerPrefix]);
    // CONTEXT VALUE PASSED TO ALL CHILDRENS
    var mapContextValue = (0, react_1.useMemo)(function () { return ({
        map: map,
        isLoading: isLoading,
        getPrefixedLayer: getPrefixedLayer,
        isStyleLoading: isStyleLoading,
        isLayerPrefixed: isLayerPrefixed,
        addClickableLayer: addClickableLayer,
        changeViewport: changeViewport,
        layerPrefix: layerPrefix
    }); }, [
        map,
        isLoading,
        getPrefixedLayer,
        isStyleLoading,
        isLayerPrefixed,
        changeViewport,
        addClickableLayer,
        layerPrefix,
    ]);
    // LOADING SATELLITE SOURCE
    var loadSatelliteSource = (0, react_1.useCallback)(function () {
        if (!map || isStyleLoading || isLoading)
            return;
        if (!map.getSource('satellite')) {
            map.addSource('satellite', constants_1.defaultSatelliteSource);
        }
    }, [map, isStyleLoading, isLoading]);
    // MAP CLICK HANDLER
    var onMapClick = (0, react_1.useCallback)(function (event) {
        onClick && onClick(event);
        if (!map)
            return;
        if (!clickableLayerIds.length)
            return;
        if (!event._defaultPrevented) {
            event.preventDefault();
            var features = map.queryRenderedFeatures(event.point);
            // filter only features from sources and from custom layers
            var filteredFeatures = features.reduce(function (filteredFeatures, feature) {
                if (
                // if layer id starts with prefix (custom layers from mapbox)
                feature.layer.id.startsWith(layerPrefix) &&
                    // if feature from that source is not included already
                    !filteredFeatures.find(function (filteredFeaturs) {
                        return filteredFeaturs.source === feature.source;
                    }) &&
                    // is clickable
                    clickableLayerIds.find(function (clickableLayerId) { return clickableLayerId === feature.layer.id; })) {
                    return __spreadArray(__spreadArray([], filteredFeatures, true), [feature], false);
                }
                return filteredFeatures;
            }, []);
            // if there is a symbol feature, ignore others
            var foundSymbolFeature = filteredFeatures.find(function (feature) {
                return feature.layer.type === 'symbol';
            });
            if (foundSymbolFeature) {
                onFeaturesClick && onFeaturesClick([foundSymbolFeature]);
            }
            else {
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
                filteredFeatures.length &&
                    onFeaturesClick &&
                    onFeaturesClick(filteredFeatures);
            }
        }
    }, [layerPrefix, onFeaturesClick, clickableLayerIds, onClick, map]);
    // MAP MOVE HANDLER
    var onMapMove = (0, react_1.useCallback)(function () {
        if (!map)
            return;
        var center = map.getCenter();
        var zoom = map.getZoom();
        var pitch = map.getPitch();
        var bearing = map.getBearing();
        var padding = map.getPadding();
        var viewport = {
            center: center,
            zoom: zoom,
            bearing: bearing,
            pitch: pitch,
            padding: padding
        };
        dispatchViewport({
            type: viewportReducer_1.ViewportActionKind.Change,
            partialViewport: viewport
        });
    }, [map]);
    // MAP MOVEEND HANDLER
    var onMapMoveEnd = (0, react_1.useCallback)(function () {
        if (!map)
            return;
        var center = map.getCenter();
        var zoom = map.getZoom();
        var pitch = map.getPitch();
        var bearing = map.getBearing();
        var padding = map.getPadding();
        var viewport = {
            center: center,
            zoom: zoom,
            bearing: bearing,
            pitch: pitch,
            padding: padding
        };
        dispatchViewport({
            type: viewportReducer_1.ViewportActionKind.Change,
            partialViewport: viewport
        });
    }, [map]);
    // REGISTER MAP LAYER EVENT CALLBACKS
    var registerMapLayerEvents = (0, react_1.useCallback)(function (customLayer) {
        if (!map)
            return;
        var hoveredFeatureId = undefined;
        map.on('mousemove', customLayer.id, function (e) {
            if (e.features && e.features.length > 0) {
                var feature_1 = e.features[0];
                // if same feature is hovered
                if (hoveredFeatureId === feature_1.id) {
                    return;
                }
                // if something was else was hovered then disable it
                else if (hoveredFeatureId !== undefined) {
                    map.setFeatureState({
                        source: feature_1.source,
                        id: hoveredFeatureId,
                        sourceLayer: customLayer['source-layer']
                    }, { hover: false });
                }
                // set hovered feature
                map.setFeatureState({
                    source: feature_1.source,
                    id: feature_1.id,
                    sourceLayer: customLayer['source-layer']
                }, { hover: true });
                hoveredFeatureId = feature_1.id;
                if (clickableLayerIds.find(function (clickableLayerId) { return clickableLayerId === feature_1.layer.id; })) {
                    map.getCanvas().style.cursor = 'pointer';
                }
            }
        });
        map.on('mouseleave', customLayer.id, function () {
            if (hoveredFeatureId !== undefined) {
                map.setFeatureState({
                    source: customLayer.source,
                    id: hoveredFeatureId,
                    sourceLayer: customLayer['source-layer']
                }, { hover: false });
            }
            hoveredFeatureId = undefined;
            map.getCanvas().style.cursor = 'default';
        });
    }, [clickableLayerIds, map]);
    // CREATE MAP
    (0, utils_1.useEffectDebugger)(function () {
        setLoading(true);
        setMap(function (map) {
            map === null || map === void 0 ? void 0 : map.remove();
            // When initializing mapbox, there should not be any child in the root component
            var containerElement = document.getElementById(mapContainerId);
            while (containerElement === null || containerElement === void 0 ? void 0 : containerElement.firstChild) {
                containerElement.removeChild(containerElement.firstChild);
            }
            // Take the first style as initial or fallback to mapbox streets v11
            var initialStyle = typeof mapStyles === 'object'
                ? mapStyles[Object.keys(mapStyles)[0]]
                : 'mapbox://styles/mapbox/streets-v11';
            var newMap = new mapbox_gl_1["default"].Map({
                accessToken: mapboxAccessToken,
                container: mapContainerId,
                style: initialStyle,
                maxZoom: maxZoom,
                minZoom: minZoom,
                cooperativeGestures: cooperativeGestures,
                locale: locale,
                maxBounds: maxBounds,
                zoom: initialViewport.zoom,
                pitch: initialViewport.pitch,
                bearing: initialViewport.bearing,
                center: [initialViewport.center.lng, initialViewport.center.lat]
            });
            newMap.on('load', function () {
                newMap.resize();
                newMap.getCanvas().style.cursor = 'default';
                setTimeout(function () { return setLoading(false); }, 0);
            });
            return newMap;
        });
    }, [
        cooperativeGestures,
        initialViewport.bearing,
        initialViewport.center.lng,
        initialViewport.center.lat,
        initialViewport.padding,
        initialViewport.pitch,
        initialViewport.zoom,
        mapContainerId,
    ], [
        'cooperativeGestures',
        'initialViewport.bearing',
        'initialViewport.center.lng',
        'initialViewport.center.lat',
        'initialViewport.padding',
        'initialViewport.pitch',
        'initialViewport.zoom',
        'mapContainerId',
    ], 'CREATE MAP');
    // REGISTER MAP EVENTS
    (0, utils_1.useEffectDebugger)(function () {
        if (!map)
            return;
        if ((!isLoading && previousLoading) ||
            (!isLoading &&
                JSON.stringify(prevClickableLayerIds) !==
                    JSON.stringify(clickableLayerIds))) {
            // get custom layers (prefixed)
            var customLayers = map
                .getStyle()
                .layers.reduce(function (layers, layer) {
                if (isLayerPrefixed(layer.id) &&
                    !layers.find(function (foundLayer) { return foundLayer.source === layer.source; })) {
                    return __spreadArray(__spreadArray([], layers, true), [layer], false);
                }
                else {
                    return layers;
                }
            }, []);
            customLayers.forEach(function (customLayer) {
                registerMapLayerEvents(customLayer);
            });
        }
        map.on('move', onMapMove);
        map.on('moveend', onMapMoveEnd);
        map.on('click', onMapClick);
        return function () {
            map.off('move', onMapMove);
            map.off('moveend', onMapMoveEnd);
            map.off('click', onMapClick);
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
        map,
    ], [
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
    ], 'REGISTER MAP EVENTS');
    // REACT TO SELECTED FEATURES STATE CHANGES
    (0, utils_1.useEffectDebugger)(function () {
        if (!map)
            return;
        // deselect previous selected features
        if (prevSelectedFeatures) {
            prevSelectedFeatures.forEach(function (feature) {
                map.setFeatureState({
                    source: feature.source,
                    id: feature.id,
                    sourceLayer: feature.layer['source-layer']
                }, { selected: false });
            });
        }
        // select the new selected features
        if (selectedFeatures) {
            selectedFeatures.forEach(function (feature) {
                map.setFeatureState({
                    source: feature.source,
                    id: feature.id,
                    sourceLayer: feature.layer['source-layer']
                }, { selected: true });
            });
        }
    }, [prevSelectedFeatures, selectedFeatures, map], ['prevSelectedFeatures', 'selectedFeatures', 'map'], 'SELECTED FEATURES');
    // NEW STYLE
    (0, utils_1.useEffectDebugger)(function () {
        var _a;
        if (!map)
            return;
        setStyleLoading(true);
        map.setStyle((_a = (isDarkmode ? mapStyles === null || mapStyles === void 0 ? void 0 : mapStyles['dark'] : mapStyles === null || mapStyles === void 0 ? void 0 : mapStyles['light'])) !== null && _a !== void 0 ? _a : 'mapbox://styles/mapbox/streets-v11');
        map.on('style.load', function () {
            setStyleLoading(false);
        });
    }, [isDarkmode, layerPrefix, mapStyles === null || mapStyles === void 0 ? void 0 : mapStyles.dark, mapStyles === null || mapStyles === void 0 ? void 0 : mapStyles.light, map], ['isDarkmode', 'layerPrefix', 'darkStyle', 'lightStyle', 'map'], 'SET STYLE');
    // SATELLITE CHANGE
    (0, utils_1.useEffectDebugger)(function () {
        if (!map || isStyleLoading || isLoading)
            return;
        if (isSatellite) {
            loadSatelliteSource();
            if (!map.getLayer('satellite-raster')) {
                var layers = map.getStyle().layers;
                var bottomLayer = layers.find(function (layer) {
                    return layer.id.startsWith(layerPrefix);
                });
                map.addLayer({
                    id: 'satellite-raster',
                    type: 'raster',
                    source: 'satellite'
                }, bottomLayer === null || bottomLayer === void 0 ? void 0 : bottomLayer.id);
            }
        }
        else {
            if (map.getLayer('satellite-raster')) {
                map.removeLayer('satellite-raster');
            }
        }
    }, [
        loadSatelliteSource,
        isSatellite,
        layerPrefix,
        map,
        isStyleLoading,
        isLoading,
    ], [
        'loadSatelliteSource',
        'isSatellite',
        'layerPrefix',
        'map',
        'isStyleLoading',
        'isLoading',
    ], 'SATELLITE CHANGE');
    // EVENTS
    (0, utils_1.useEffectDebugger)(function () {
        onViewportChange && onViewportChange(viewport);
    }, [map, viewport, onViewportChange], ['map', 'viewport', 'onViewportChange'], 'VIEWPORT');
    (0, utils_1.useEffectDebugger)(function () {
        onViewportChangeDebounced &&
            onViewportChangeDebounced(debouncedViewport);
    }, [debouncedViewport, onViewportChangeDebounced], ['debouncedViewport', 'onViewportChangeDebounced'], 'DEBOUNCED VIEWPORT');
    // INTERACTIVITY CHANGE
    (0, utils_1.useEffectDebugger)(function () {
        if (!map)
            return;
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
            }
            else {
                map.dragRotate.enable();
                map.touchZoomRotate.enableRotation();
            }
            if (disablePitch) {
                map.touchPitch.disable();
                map.setMaxPitch(0);
            }
            else {
                map.touchPitch.enable();
            }
        }
        else {
            map.scrollZoom.disable();
            map.boxZoom.disable();
            map.dragRotate.disable();
            map.dragPan.disable();
            map.keyboard.disable();
            map.touchZoomRotate.disable();
            map.doubleClickZoom.disable();
            map.touchPitch.disable();
        }
    }, [interactive, disableBearing, disablePitch, map], ['interactive', 'disableBearing', 'disablePitch', 'map'], 'SET INTERACTIVITY');
    (0, utils_1.useEffectDebugger)(function () {
        if (isLoading === false && previousLoading === true) {
            onLoad && onLoad();
        }
    }, [isLoading, onLoad, previousLoading], ['isLoading', 'onLoad', 'previousLoading'], 'MAP LOADED');
    // EXPOSING METHODS FOR PARENT COMPONENT
    (0, react_1.useImperativeHandle)(forwardedRef, function () { return ({
        changeViewport: changeViewport,
        fitBounds: fitBounds
    }); });
    return (<>
        <exports.mapboxContext.Provider value={mapContextValue}>
          <div id={mapContainerId} style={{ width: '100%', height: '100%' }}/>
          {children}
          <DevelopmentInfo_1.DevelopmentInfo isDevelopment={isDevelopment} viewport={viewport}/>
        </exports.mapboxContext.Provider>
      </>);
});
exports.Mapbox.displayName = 'Mapbox';
exports["default"] = exports.Mapbox;
