"use strict";
exports.__esModule = true;
exports.ViewportController = void 0;
var classnames_1 = require("classnames");
var react_1 = require("react");
var Map_1 = require("../Map/Map");
var CompassButton_1 = require("./CompassButton");
var FullscreenButton_1 = require("./FullscreenButton");
var GeolocationButton_1 = require("./GeolocationButton");
var LegendButton_1 = require("./LegendButton");
var ZoomButtons_1 = require("./ZoomButtons");
var defaultSlots = ['compass', 'zoom'];
var defaultDesktopSlots = [
    'geolocation',
    'compass',
    ['fullscreen', 'zoom'],
];
exports.ViewportController = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, _b = _a.slots, slots = _b === void 0 ? defaultSlots : _b, _c = _a.desktopSlots, desktopSlots = _c === void 0 ? defaultDesktopSlots : _c, legend = _a.legend, isLegendOpen = _a.isLegendOpen, onLegendOpenChange = _a.onLegendOpenChange;
    var legendButton = (0, react_1.useMemo)(function () {
        if (isLegendOpen !== undefined && onLegendOpenChange) {
            return (<LegendButton_1.LegendButton legend={legend} isLegendOpen={isLegendOpen} onLegendOpenChange={onLegendOpenChange}/>);
        }
        return null;
    }, [legend, onLegendOpenChange, isLegendOpen]);
    var geolocationButton = (0, react_1.useMemo)(function () {
        return <GeolocationButton_1.GeolocationButton />;
    }, []);
    var compassButton = (0, react_1.useMemo)(function () {
        return <CompassButton_1.CompassButton />;
    }, []);
    var fullscreenButton = (0, react_1.useMemo)(function () {
        return <FullscreenButton_1.FullscreenButton />;
    }, []);
    var zoomButton = (0, react_1.useMemo)(function () {
        return <ZoomButtons_1.ZoomButtons />;
    }, []);
    var slotMap = (0, react_1.useMemo)(function () {
        return {
            legend: legendButton,
            geolocation: geolocationButton,
            compass: compassButton,
            fullscreen: fullscreenButton,
            zoom: zoomButton
        };
    }, [
        compassButton,
        fullscreenButton,
        geolocationButton,
        legendButton,
        zoomButton,
    ]);
    var isMobile = (0, react_1.useContext)(Map_1.mapContext).isMobile;
    var resultSlots = (0, react_1.useMemo)(function () {
        return isMobile ? slots : desktopSlots;
    }, [desktopSlots, isMobile, slots]);
    return (<div ref={ref} className={(0, classnames_1["default"])('transform  duration-500 ease-in-out transition-transform pointer-events-none', className)}>
        <div className="flex items-end gap-2">
          {resultSlots.map(function (slot, i) {
            return Array.isArray(slot) ? (<div key={i} className="flex flex-col gap-2">
                {slot.map(function (subSlot, j) {
                    return Array.isArray(subSlot) ? null : (<react_1.Fragment key={j}>{slotMap[subSlot]}</react_1.Fragment>);
                })}
              </div>) : (<react_1.Fragment key={i}>{slotMap[slot]}</react_1.Fragment>);
        })}
        </div>
      </div>);
});
exports.ViewportController.displayName = 'ViewportController';
