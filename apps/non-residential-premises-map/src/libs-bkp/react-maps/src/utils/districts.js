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
exports.getFeatureDistrict = exports.addDistrictPropertyToLayer = exports.DISTRICTS = void 0;
var geojson_data_1 = require("@bratislava/geojson-data");
var boolean_intersects_1 = require("@turf/boolean-intersects");
var helpers_1 = require("@turf/helpers");
exports.DISTRICTS = [
    'Staré Mesto',
    'Ružinov',
    'Vrakuňa',
    'Podunajské Biskupice',
    'Nové Mesto',
    'Rača',
    'Vajnory',
    'Karlova Ves',
    'Dúbravka',
    'Lamač',
    'Devín',
    'Devínska Nová Ves',
    'Záhorská Bystrica',
    'Petržalka',
    'Jarovce',
    'Rusovce',
    'Čunovo',
];
var addDistrictPropertyToLayer = function (collection) {
    return (0, helpers_1.featureCollection)(collection.features.map(function (feature) { return (__assign(__assign({}, feature), { properties: __assign(__assign({}, feature.properties), { district: (0, exports.getFeatureDistrict)(feature) }) })); }));
};
exports.addDistrictPropertyToLayer = addDistrictPropertyToLayer;
var getFeatureDistrict = function (feature) {
    var districtFeatures = geojson_data_1.DISTRICTS_GEOJSON.features;
    for (var _i = 0, districtFeatures_1 = districtFeatures; _i < districtFeatures_1.length; _i++) {
        var districtFeature = districtFeatures_1[_i];
        if ((0, boolean_intersects_1["default"])(districtFeature.geometry, feature)) {
            return districtFeature.properties.name;
        }
    }
    return null;
};
exports.getFeatureDistrict = getFeatureDistrict;
