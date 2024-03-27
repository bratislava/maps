"use strict";
exports.__esModule = true;
exports.SearchBar = void 0;
var react_maps_icons_1 = require("@bratislava/react-maps-icons");
var react_maps_ui_1 = require("@bratislava/react-maps-ui");
var helpers_1 = require("@turf/helpers");
var react_1 = require("react");
var useMapboxSearch_1 = require("../../hooks/useMapboxSearch");
var Map_1 = require("../Map/Map");
function SearchBar(_a) {
    var direction = _a.direction, language = _a.language, placeholder = _a.placeholder;
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = (0, react_1.useContext)(Map_1.mapContext), mapState = _c.mapState, mapboxAccessToken = _c.mapboxAccessToken, mapMethods = _c.methods;
    var results = (0, useMapboxSearch_1.useMapboxSearch)({
        searchQuery: searchQuery,
        language: language,
        mapboxAccessToken: mapboxAccessToken
    }).results;
    var options = (0, react_1.useMemo)(function () {
        var _a;
        return ((_a = results === null || results === void 0 ? void 0 : results.map(function (result) {
            if (result.place_type.includes('poi')) {
                return {
                    title: result.text +
                        (result.properties.address
                            ? ", ".concat(result.properties.address)
                            : ''),
                    label: (<div>
                {result.text}
                <span className="font-normal opacity-75">
                  {result.properties.address
                            ? ", ".concat(result.properties.address)
                            : ''}
                </span>
              </div>),
                    value: result.place_name,
                    feature: result
                };
            }
            return {
                // ugly workaround for ugly addresses from mapbox
                title: result.text + (result.address ? " ".concat(result.address) : ''),
                label: result.text + (result.address ? " ".concat(result.address) : ''),
                value: result.place_name,
                feature: result
            };
        })) !== null && _a !== void 0 ? _a : []);
    }, [results]);
    var handleOptionPress = (0, react_1.useCallback)(function (option) {
        mapMethods.addSearchMarker({
            lng: option.feature.geometry.coordinates[0],
            lat: option.feature.geometry.coordinates[1]
        });
        mapMethods.moveToFeatures((0, helpers_1.point)(option.feature.geometry.coordinates), {
            zoom: 16
        });
    }, [mapMethods]);
    var handleResetPress = (0, react_1.useCallback)(function () {
        mapMethods.removeSearchMarker();
        setSearchQuery('');
    }, [mapMethods]);
    return (<react_maps_ui_1.ComboBox direction={direction} options={options} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} onOptionPress={handleOptionPress} placeholder={placeholder} rightSlot={<div className="absolute inset-y-0 right-[3px] flex items-center gap-[4px]">
          {searchQuery && searchQuery.length > 0 ? (<button className="p-3" onClick={handleResetPress}>
              <react_maps_icons_1.X size="sm"/>
            </button>) : (<div className="p-2">
              <react_maps_icons_1.MagnifyingGlass size="lg"/>
            </div>)}
          <div className="bg-gray-lightmode dark:bg-gray-darkmode h-8 w-[2px] opacity-20 md:hidden"/>
          <button onClick={mapMethods.toggleGeolocation} className="flex h-10 translate-x-[1px] items-center justify-center p-2 md:hidden">
            <react_maps_icons_1.Location size="lg" isActive={mapState === null || mapState === void 0 ? void 0 : mapState.isGeolocation}/>
          </button>
        </div>}/>);
}
exports.SearchBar = SearchBar;
