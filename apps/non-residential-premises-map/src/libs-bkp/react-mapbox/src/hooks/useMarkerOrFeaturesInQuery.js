"use strict";
exports.__esModule = true;
exports.useMarkerOrFeaturesInQuery = void 0;
var react_1 = require("react");
var useMarkerOrFeaturesInQuery = function (_a) {
    var markersData = _a.markersData, selectedMarker = _a.selectedMarker, selectedFeatures = _a.selectedFeatures, setSelectedMarkerAndZoom = _a.setSelectedMarkerAndZoom, setSelectedFeaturesAndZoom = _a.setSelectedFeaturesAndZoom, zoomAtWhichMarkerWasSelected = _a.zoomAtWhichMarkerWasSelected;
    var _b = (0, react_1.useState)(false), isInitialMarkerSet = _b[0], setIsInitialMarkerSet = _b[1];
    // sets marker from query on initial markersData load
    (0, react_1.useEffect)(function () {
        var _a;
        if (isInitialMarkerSet || !((_a = markersData === null || markersData === void 0 ? void 0 : markersData.features) === null || _a === void 0 ? void 0 : _a.length))
            return;
        setIsInitialMarkerSet(true);
        try {
            var urlParams = new URLSearchParams(window.location.hash.substring(1));
            var markerId_1 = urlParams.get('marker');
            var featuresIds_1 = urlParams.getAll('featureId');
            var parsedZoom = Number.parseInt(urlParams.get('zoom') || '') || null;
            if (typeof markerId_1 === 'string') {
                if (!setSelectedMarkerAndZoom)
                    throw new Error('Trying to set marker without setSelectedMarkerAndZoom function');
                var marker = markersData.features.find(function (marker) { return marker.id === markerId_1; });
                if (marker &&
                    (marker.geometry.type === 'Point' ||
                        marker.geometry.type === 'MultiPoint')) {
                    setSelectedMarkerAndZoom(marker, parsedZoom);
                }
            }
            else if (featuresIds_1.length) {
                if (!setSelectedFeaturesAndZoom)
                    throw new Error('Trying to set features without setSelectedFeaturesAndZoom function');
                var features = markersData.features.filter(function (feature) {
                    return featuresIds_1.includes("".concat(feature.id));
                });
                setSelectedFeaturesAndZoom(features, parsedZoom);
            }
        }
        catch (error) {
            console.error('Error when setting initial location on the map- please provide the log below to support email address provided on the page.');
            console.error(error);
        }
    }, [
        isInitialMarkerSet,
        markersData === null || markersData === void 0 ? void 0 : markersData.features,
        setSelectedFeaturesAndZoom,
        setSelectedMarkerAndZoom,
    ]);
    // puts selected marker's id into url query
    (0, react_1.useEffect)(function () {
        if (!isInitialMarkerSet)
            return;
        var urlParams = new URLSearchParams(window.location.hash.substring(1));
        if (selectedMarker === null || selectedMarker === void 0 ? void 0 : selectedMarker.id) {
            urlParams.set('marker', selectedMarker.id.toString());
            if (zoomAtWhichMarkerWasSelected) {
                urlParams.set('zoom', zoomAtWhichMarkerWasSelected.toString());
            }
        }
        else if (selectedFeatures === null || selectedFeatures === void 0 ? void 0 : selectedFeatures.length) {
            selectedFeatures.forEach(function (feature) {
                urlParams.append('featureId', "".concat(feature.id));
                if (zoomAtWhichMarkerWasSelected) {
                    urlParams.set('zoom', zoomAtWhichMarkerWasSelected.toString());
                }
            });
        }
        else {
            urlParams["delete"]('marker');
            urlParams["delete"]('featureId');
            urlParams["delete"]('zoom');
        }
        window.location.hash = urlParams.toString();
    }, [
        isInitialMarkerSet,
        selectedMarker === null || selectedMarker === void 0 ? void 0 : selectedMarker.id,
        zoomAtWhichMarkerWasSelected,
        selectedFeatures,
    ]);
};
exports.useMarkerOrFeaturesInQuery = useMarkerOrFeaturesInQuery;
