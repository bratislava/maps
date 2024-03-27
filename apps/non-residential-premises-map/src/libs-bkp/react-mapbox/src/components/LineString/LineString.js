"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.LineString = void 0;
var react_1 = require("react");
var utils_1 = require("@bratislava/utils");
var log_1 = require("../../utils/log");
var Mapbox_1 = require("../Mapbox/Mapbox");
var framer_motion_1 = require("framer-motion");
var line_slice_along_1 = require("@turf/line-slice-along");
var length_1 = require("@turf/length");
var helpers_1 = require("@turf/helpers");
var LineString = function (_a) {
    var id = _a.id, styles = _a.styles, coordinates = _a.coordinates, _b = _a.isVisible, isVisible = _b === void 0 ? true : _b, _c = _a.visiblePart, visiblePart = _c === void 0 ? 1 : _c, _d = _a.initialVisiblePart, initialVisiblePart = _d === void 0 ? 0 : _d, _e = _a.duration, duration = _e === void 0 ? 1000 : _e, onAnimationDone = _a.onAnimationDone, onAnimationChange = _a.onAnimationChange;
    var _f = (0, react_1.useContext)(Mapbox_1.mapboxContext), map = _f.map, isLoading = _f.isLoading, getPrefixedLayer = _f.getPrefixedLayer, isStyleLoading = _f.isStyleLoading, addClickableLayer = _f.addClickableLayer;
    var previousLoading = (0, utils_1.usePrevious)(isLoading);
    var previousVisible = (0, utils_1.usePrevious)(isVisible);
    var _g = (0, react_1.useState)(false), isSourceAdded = _g[0], setSourceAdded = _g[1];
    var _h = (0, react_1.useState)((0, helpers_1.lineString)(coordinates)), line = _h[0], setLine = _h[1];
    (0, react_1.useEffect)(function () {
        var line = (0, helpers_1.lineString)(coordinates);
        var lineLength = (0, length_1["default"])(line, { units: 'meters' });
        line.properties
            ? (line.properties.length = lineLength)
            : (line.properties = { length: lineLength });
        setLine(line);
    }, [coordinates]);
    (0, react_1.useEffect)(function () {
        if (map && !isLoading && !isStyleLoading) {
            map.addSource(id, {
                type: 'geojson',
                data: (0, helpers_1.featureCollection)([])
            });
            setSourceAdded(true);
            styles.forEach(function (style) {
                var isLayerAlreadyThere = map.getLayer(getPrefixedLayer(style.id));
                if (!isLayerAlreadyThere) {
                    map.addLayer(__assign(__assign({ source: id }, style), { id: getPrefixedLayer(style.id) }));
                }
                if (previousVisible !== isVisible ||
                    isLoading !== previousLoading ||
                    !isLayerAlreadyThere) {
                    if (isVisible) {
                        (0, log_1.log)("SETTING LAYER ".concat(getPrefixedLayer(style.id), " VISIBLE"));
                        map.setLayoutProperty(getPrefixedLayer(style.id), 'visibility', 'visible');
                    }
                    else {
                        (0, log_1.log)("SETTING LAYER ".concat(getPrefixedLayer(style.id), " HIDDEN"));
                        map.setLayoutProperty(getPrefixedLayer(style.id), 'visibility', 'none');
                    }
                }
            });
        }
        return function () {
            // cleaning
            if (map && !isLoading && !isStyleLoading) {
                styles.forEach(function (style) {
                    if (map.getLayer(getPrefixedLayer(style.id)))
                        map.removeLayer(getPrefixedLayer(style.id));
                });
                if (map.getSource(id))
                    map.removeSource(id);
                setSourceAdded(false);
            }
        };
    }, [
        isLoading,
        map,
        previousVisible,
        isVisible,
        getPrefixedLayer,
        isStyleLoading,
        styles,
        addClickableLayer,
        previousLoading,
        id,
        coordinates,
        line,
    ]);
    var completeHandler = (0, react_1.useCallback)(function () {
        onAnimationDone && onAnimationDone();
    }, [onAnimationDone]);
    var drawLineHandler = (0, react_1.useCallback)(function (value) {
        var _a, _b;
        var fullLineLength = (_b = (_a = line.properties) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        var visibleLineLength = fullLineLength * value;
        var source = map === null || map === void 0 ? void 0 : map.getSource(id);
        if (visibleLineLength === 0) {
            if (isSourceAdded && source && source.type === 'geojson') {
                source.setData((0, helpers_1.featureCollection)([]));
            }
        }
        else {
            var visibleLine = (0, line_slice_along_1["default"])(line, 0, visibleLineLength, {
                units: 'meters'
            });
            var coordinates_1 = visibleLine.geometry.coordinates;
            var coordinatesLength = coordinates_1.length;
            var lastCoordinate = coordinates_1[coordinatesLength - 1];
            onAnimationChange &&
                onAnimationChange({
                    value: value,
                    center: { lng: lastCoordinate[0], lat: lastCoordinate[1] }
                });
            if (visiblePart === value) {
                completeHandler();
            }
            if (isSourceAdded && source && source.type === 'geojson') {
                source.setData((0, helpers_1.featureCollection)([visibleLine]));
            }
        }
    }, [
        id,
        isSourceAdded,
        line,
        map,
        completeHandler,
        visiblePart,
        onAnimationChange,
    ]);
    (0, react_1.useEffect)(function () {
        if (initialVisiblePart === visiblePart) {
            drawLineHandler(visiblePart);
        }
        else {
            var animation_1 = (0, framer_motion_1.animate)(initialVisiblePart, visiblePart, {
                duration: duration,
                onUpdate: drawLineHandler
            });
            return function () {
                if (animation_1.isAnimating())
                    animation_1.stop();
            };
        }
    }, [
        completeHandler,
        drawLineHandler,
        duration,
        initialVisiblePart,
        visiblePart,
    ]);
    return null;
};
exports.LineString = LineString;
