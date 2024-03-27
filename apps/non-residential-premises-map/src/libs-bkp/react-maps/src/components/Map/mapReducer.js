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
exports.mapReducer = exports.MapActionKind = void 0;
var MapActionKind;
(function (MapActionKind) {
    MapActionKind["EnableDarkmode"] = "EnableDarkmode";
    MapActionKind["DisableDarkmode"] = "DisableDarkmode";
    MapActionKind["ToggleDarkmode"] = "ToggleDarkmode";
    MapActionKind["SetDarkmode"] = "SetDarkmode";
    MapActionKind["SetSatellite"] = "SetSatellite";
    MapActionKind["SetFullscreen"] = "SetFullscreen";
    MapActionKind["ChangeViewport"] = "ChangeViewport";
    MapActionKind["EnableGeolocation"] = "EnableGeolocation";
    MapActionKind["DisableGeolocation"] = "DisableGeolocation";
    MapActionKind["AddSearchMarker"] = "AddSearchMarker";
    MapActionKind["RemoveSearchMarker"] = "RemoveSearchMarker";
})(MapActionKind = exports.MapActionKind || (exports.MapActionKind = {}));
var mapReducer = function (state, action) {
    switch (action.type) {
        case MapActionKind.EnableDarkmode: {
            return __assign(__assign({}, state), { isSatellite: false, isDarkmode: true });
        }
        case MapActionKind.DisableDarkmode: {
            return __assign(__assign({}, state), { isSatellite: false, isDarkmode: false });
        }
        case MapActionKind.ToggleDarkmode: {
            return __assign(__assign({}, state), { isSatellite: false, isDarkmode: !state.isDarkmode });
        }
        case MapActionKind.SetDarkmode: {
            return __assign(__assign({}, state), { isSatellite: false, isDarkmode: action.value });
        }
        case MapActionKind.SetSatellite: {
            return __assign(__assign({}, state), { isSatellite: action.value });
        }
        case MapActionKind.SetFullscreen: {
            return __assign(__assign({}, state), { isFullscreen: action.value });
        }
        case MapActionKind.ChangeViewport: {
            return __assign(__assign({}, state), { viewport: action.viewport });
        }
        case MapActionKind.EnableGeolocation: {
            return __assign(__assign({}, state), { isGeolocation: true, geolocationMarkerLngLat: action.geolocationMarkerLngLat });
        }
        case MapActionKind.DisableGeolocation: {
            return __assign(__assign({}, state), { isGeolocation: false, geolocationMarkerLngLat: null });
        }
        case MapActionKind.AddSearchMarker: {
            return __assign(__assign({}, state), { searchMarkerLngLat: action.searchMarkerLngLat });
        }
        case MapActionKind.RemoveSearchMarker: {
            return __assign(__assign({}, state), { searchMarkerLngLat: null });
        }
    }
};
exports.mapReducer = mapReducer;
