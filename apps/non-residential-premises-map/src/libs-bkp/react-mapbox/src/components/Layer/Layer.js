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
exports.Layer = void 0;
var utils_1 = require("../../../../../libs/utils");
var mapbox_gl_1 = require("mapbox-gl");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var log_1 = require("../../utils/log");
var Mapbox_1 = require("../Mapbox/Mapbox");
var Layer = function (_a) {
    var geojson = _a.geojson, styles = _a.styles, _b = _a.isVisible, isVisible = _b === void 0 ? true : _b, _c = _a.hidePopup, hidePopup = _c === void 0 ? true : _c, _d = _a.filters, filters = _d === void 0 ? [] : _d, _e = _a.ignoreFilters, ignoreFilters = _e === void 0 ? false : _e, _f = _a.ignoreClick, ignoreClick = _f === void 0 ? false : _f, hoverPopup = _a.hoverPopup;
    var _g = (0, react_1.useContext)(Mapbox_1.mapboxContext), map = _g.map, getPrefixedLayer = _g.getPrefixedLayer, isLoading = _g.isLoading, isStyleLoading = _g.isStyleLoading, addClickableLayer = _g.addClickableLayer, layerPrefix = _g.layerPrefix;
    var layerIdStartsWith = 'label';
    var previousLoading = (0, utils_1.usePrevious)(isLoading);
    var previousStyleLoading = (0, utils_1.usePrevious)(isStyleLoading);
    var previousVisible = (0, utils_1.usePrevious)(isVisible);
    var previousIgnoreFilters = (0, utils_1.usePrevious)(ignoreFilters);
    var previousFilters = (0, utils_1.usePrevious)(filters);
    var id = (0, react_1.useId)();
    var _h = (0, react_1.useState)(false), isPopupVisible = _h[0], setPopupVisible = _h[1];
    var _j = (0, react_1.useState)(null), renderedPopupContent = _j[0], setRenderedPopupContent = _j[1];
    var popupElement = (0, react_1.useMemo)(function () {
        return document.createElement('div');
    }, []);
    var popup = (0, react_1.useMemo)(function () {
        return new mapbox_gl_1.Popup({
            closeButton: false,
            closeOnClick: false
        })
            .setLngLat([0, 0])
            .setDOMContent(popupElement);
    }, [popupElement]);
    (0, react_1.useEffect)(function () {
        if (!map)
            return;
        if (isPopupVisible) {
            popup.addTo(map);
            popupElement.setAttribute('style', "".concat(popupElement.style, "; z-index: 100; pointer-events: none;"));
        }
        return function () {
            if (isPopupVisible) {
                popup.remove();
            }
        };
    }, [map, popup, popupElement, isPopupVisible]);
    (0, react_1.useEffect)(function () {
        hidePopup && setPopupVisible(false);
    }, [hidePopup]);
    var renderPopupContent = (0, react_1.useCallback)(function (e) {
        var _a, _b, _c;
        setRenderedPopupContent(typeof hoverPopup === 'function'
            ? hoverPopup((_c = (_b = (_a = e.features) === null || _a === void 0 ? void 0 : _a[0].properties) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '')
            : hoverPopup);
    }, [hoverPopup]);
    var onMouseEnter = (0, react_1.useCallback)(function () {
        setPopupVisible(true);
    }, []);
    var onMouseMove = (0, react_1.useCallback)(function (e) {
        popup.setLngLat(e.lngLat);
        renderPopupContent(e);
    }, [popup, renderPopupContent]);
    var onMouseLeave = (0, react_1.useCallback)(function () {
        setPopupVisible(false);
    }, []);
    (0, react_1.useEffect)(function () {
        if (hoverPopup && map) {
            styles.forEach(function (style) {
                if (style.type !== 'line') {
                    map.on('mouseenter', getPrefixedLayer(style.id), onMouseEnter);
                    map.on('mousemove', getPrefixedLayer(style.id), onMouseMove);
                    map.on('mouseleave', getPrefixedLayer(style.id), onMouseLeave);
                }
            });
        }
        return function () {
            if (hoverPopup && map) {
                styles.forEach(function (style) {
                    if (style.type !== 'line') {
                        map.off('mouseenter', getPrefixedLayer(style.id), onMouseEnter);
                        map.off('mousemove', getPrefixedLayer(style.id), onMouseMove);
                        map.off('mouseleave', getPrefixedLayer(style.id), onMouseLeave);
                    }
                });
            }
        };
    }, [
        hoverPopup,
        map,
        styles,
        onMouseEnter,
        onMouseMove,
        onMouseLeave,
        getPrefixedLayer,
    ]);
    (0, react_1.useEffect)(function () {
        if (map && !isLoading && !isStyleLoading) {
            styles.forEach(function (style) {
                var _a;
                if (!map || !geojson)
                    return;
                var existingSource = map.getSource(id);
                if (!!existingSource && existingSource.type === 'geojson') {
                    existingSource.setData(geojson);
                }
                else {
                    map.addSource(id, {
                        type: 'geojson',
                        data: geojson,
                        tolerance: 0
                    });
                }
                if (!map.getLayer(getPrefixedLayer(style.id))) {
                    var layerId = (_a = map
                        .getStyle()
                        .layers.find(function (layer) { return layer.id.includes(layerIdStartsWith); })) === null || _a === void 0 ? void 0 : _a.id;
                    var layers = map.getStyle().layers;
                    var bottomLayer = layers.find(function (layer) {
                        return layer.id.startsWith(layerPrefix);
                    });
                    map.addLayer(__assign(__assign({ source: id }, style), { id: getPrefixedLayer(style.id) }), style.type === 'line' || style.type === 'circle'
                        ? layerId
                        : style.type === 'fill'
                            ? bottomLayer === null || bottomLayer === void 0 ? void 0 : bottomLayer.id
                            : undefined);
                    if (!ignoreClick) {
                        addClickableLayer(getPrefixedLayer(style.id));
                    }
                }
                if (previousVisible !== isVisible ||
                    isLoading !== previousLoading ||
                    isStyleLoading !== previousStyleLoading) {
                    if (isVisible) {
                        (0, log_1.log)("SETTING LAYER ".concat(getPrefixedLayer(style.id), " VISIBLE"));
                        map.setLayoutProperty(getPrefixedLayer(style.id), 'visibility', 'visible');
                    }
                    else {
                        (0, log_1.log)("SETTING LAYER ".concat(getPrefixedLayer(style.id), " HIDDEN"));
                        map.setLayoutProperty(getPrefixedLayer(style.id), 'visibility', 'none');
                        setPopupVisible(false);
                    }
                }
                var resultFilters = [];
                if (!ignoreFilters) {
                    if (filters && filters.length) {
                        resultFilters.push.apply(resultFilters, filters);
                    }
                }
                if (resultFilters && resultFilters.length) {
                    map.setFilter(getPrefixedLayer(style.id), resultFilters.filter(function (filter) { return filter; }));
                }
                else {
                    map.setFilter(getPrefixedLayer(style.id), null);
                }
            });
        }
    }, [
        isLoading,
        geojson,
        id,
        map,
        previousVisible,
        isVisible,
        filters,
        getPrefixedLayer,
        isStyleLoading,
        ignoreFilters,
        styles,
        previousIgnoreFilters,
        previousFilters,
        ignoreClick,
        addClickableLayer,
        previousLoading,
        layerPrefix,
        previousStyleLoading,
    ]);
    return (0, react_dom_1.createPortal)(renderedPopupContent, popupElement);
};
exports.Layer = Layer;
