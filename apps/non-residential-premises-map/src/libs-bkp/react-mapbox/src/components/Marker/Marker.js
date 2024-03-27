"use strict";
exports.__esModule = true;
exports.Marker = void 0;
var mapbox_gl_1 = require("mapbox-gl");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var Filter_1 = require("../Filter/Filter");
var Mapbox_1 = require("../Mapbox/Mapbox");
var framer_motion_1 = require("framer-motion");
var Marker = function (_a) {
    var _b;
    var children = _a.children, feature = _a.feature, _c = _a.isRelativeToZoom, isRelativeToZoom = _c === void 0 ? false : _c, _d = _a.baseZoom, baseZoom = _d === void 0 ? 12 : _d, _e = _a.scalePercentMultiplier, scalePercentMultiplier = _e === void 0 ? 0.25 : _e, className = _a.className, onClick = _a.onClick, _f = _a.ignoreFilters, ignoreFilters = _f === void 0 ? false : _f, _g = _a.origin, origin = _g === void 0 ? 'center' : _g, _h = _a.zIndex, zIndex = _h === void 0 ? 0 : _h;
    var isFeatureVisible = (0, react_1.useContext)(Filter_1.filterContext).isFeatureVisible;
    var map = (0, react_1.useContext)(Mapbox_1.mapboxContext).map;
    var _j = (0, react_1.useState)(1), scale = _j[0], setScale = _j[1];
    var marker = (0, react_1.useMemo)(function () {
        return new mapbox_gl_1.Marker({
            element: document.createElement('div')
        }).setLngLat([0, 0]);
    }, []);
    var recalculateScale = (0, react_1.useCallback)(function () {
        var _a;
        if (isRelativeToZoom) {
            var zoom = (_a = map === null || map === void 0 ? void 0 : map.getZoom()) !== null && _a !== void 0 ? _a : 0;
            var scalePercent = 1 + (zoom - baseZoom) * scalePercentMultiplier;
            setScale(Math.max(scalePercent, 0));
        }
        else {
            setScale(1);
        }
    }, [map, baseZoom, isRelativeToZoom]);
    (0, react_1.useEffect)(function () {
        recalculateScale();
        map === null || map === void 0 ? void 0 : map.on('zoom', recalculateScale);
        return function () {
            map === null || map === void 0 ? void 0 : map.off('zoom', recalculateScale);
        };
    }, [map, recalculateScale, isRelativeToZoom]);
    (0, react_1.useEffect)(function () {
        marker.setLngLat(feature.geometry.coordinates);
    }, [marker, feature.geometry.coordinates]);
    (0, react_1.useEffect)(function () {
        if (!map)
            return;
        marker.addTo(map);
        var element = marker.getElement();
        element.setAttribute('style', "".concat(element.style, "; z-index: ").concat(zIndex, ";"));
        return function () {
            marker.remove();
        };
    }, [map, marker, zIndex]);
    var clickHandler = (0, react_1.useCallback)(function (e) {
        e.stopPropagation();
        onClick && onClick(e);
    }, [onClick]);
    var isVisible = (0, react_1.useMemo)(function () {
        if (ignoreFilters)
            return true;
        if (isFeatureVisible) {
            return isFeatureVisible(feature);
        }
        return true;
    }, [feature, isFeatureVisible, ignoreFilters]);
    return (0, react_dom_1.createPortal)(isVisible ? (<div style={{
            transformOrigin: origin,
            transform: "scale(".concat(scale, ")"),
            background: 'red',
            width: 0,
            height: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }} className={className}>
        <framer_motion_1.motion.div onMouseMove={function (e) { return e.stopPropagation(); }} initial={{ scale: 0 }} exit={{ scale: 0 }} animate={{
            scale: 1
        }} onClick={clickHandler} style={_b = {
                position: 'absolute'
            },
            _b[origin] = 0,
            _b}>
          {children}
        </framer_motion_1.motion.div>
      </div>) : null, marker.getElement());
};
exports.Marker = Marker;
