"use strict";
exports.__esModule = true;
exports.ZoomButtons = void 0;
var react_maps_icons_1 = require("@bratislava/react-maps-icons");
var react_maps_ui_1 = require("@bratislava/react-maps-ui");
var react_1 = require("react");
var Map_1 = require("../Map/Map");
function ZoomButtons() {
    var _a = (0, react_1.useContext)(Map_1.mapContext), mapState = _a.mapState, mapMethods = _a.methods;
    // ZOOM IN HANDLER
    var handleZoomInClick = (0, react_1.useCallback)(function () {
        var _a;
        mapMethods.changeViewport({ zoom: ((_a = mapState === null || mapState === void 0 ? void 0 : mapState.viewport.zoom) !== null && _a !== void 0 ? _a : 0) + 0.5 });
    }, [mapMethods, mapState === null || mapState === void 0 ? void 0 : mapState.viewport.zoom]);
    // ZOOM OUT HANDLER
    var handleZoomOutClick = (0, react_1.useCallback)(function () {
        var _a;
        mapMethods.changeViewport({ zoom: ((_a = mapState === null || mapState === void 0 ? void 0 : mapState.viewport.zoom) !== null && _a !== void 0 ? _a : 0) - 0.5 });
    }, [mapMethods, mapState === null || mapState === void 0 ? void 0 : mapState.viewport.zoom]);
    return (<react_maps_ui_1.IconButtonGroup>
      <react_maps_ui_1.IconButton noAnimation noStyle onClick={handleZoomInClick}>
        <react_maps_icons_1.Plus size="default"/>
      </react_maps_ui_1.IconButton>
      <react_maps_ui_1.IconButton noAnimation noStyle onClick={handleZoomOutClick}>
        <react_maps_icons_1.Minus size="default"/>
      </react_maps_ui_1.IconButton>
    </react_maps_ui_1.IconButtonGroup>);
}
exports.ZoomButtons = ZoomButtons;
