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
exports.processData = void 0;
var react_maps_1 = require("@bratislava/react-maps");
var utils_1 = require("@bratislava/utils");
var helpers_1 = require("@turf/helpers");
var colors_1 = require("../utils/colors");
var processData = function (rawData) {
    var data = (0, react_maps_1.addDistrictPropertyToLayer)((0, helpers_1.featureCollection)(rawData.features.map(function (feature) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        var originalPropertiesKeys = Object.keys((_a = feature.properties) !== null && _a !== void 0 ? _a : {});
        var originalOccupancy = (_b = feature.properties) === null || _b === void 0 ? void 0 : _b["Obsadenosť"];
        var occupancy = originalOccupancy === "na prenájom"
            ? "forRent"
            : originalOccupancy === "obsadené"
                ? "occupied"
                : originalOccupancy === "nie je k dispozícii"
                    ? "other"
                    : "free";
        var color = occupancy === "forRent"
            ? colors_1.colors.forRent
            : occupancy === "occupied"
                ? colors_1.colors.occupied
                : occupancy === "other"
                    ? colors_1.colors.other
                    : colors_1.colors.free;
        var locality = (_c = feature.properties) === null || _c === void 0 ? void 0 : _c["Ulica_a_cislo_vchodu"];
        var street = locality === null || locality === void 0 ? void 0 : locality.replaceAll(/[0-9]/g, "").trim().split(",")[0];
        var competition = ((_d = feature.properties) === null || _d === void 0 ? void 0 : _d["aktualne_prebiehajuca_sutaz"]) === "neprebieha"
            ? false
            : (_e = feature.properties) === null || _e === void 0 ? void 0 : _e["aktualne_prebiehajuca_sutaz"];
        return __assign(__assign({}, feature), { properties: __assign(__assign({}, originalPropertiesKeys.reduce(function (prev, key) {
                var _a;
                var _b;
                return (__assign(__assign({}, prev), (_a = {}, _a["ORIGINAL_".concat(key)] = (_b = feature.properties) === null || _b === void 0 ? void 0 : _b[key], _a)));
            }, {})), { locality: locality, purpose: (_f = feature.properties) === null || _f === void 0 ? void 0 : _f["ucel_najmu"], lessee: (_g = feature.properties) === null || _g === void 0 ? void 0 : _g["najomca"], 
                // sometimes the picture urls come with a token in query string, which forces you to login even when the picture is public
                // in such cases, getting rid of the entire query (which shouldn't contain anything else of value) solves the issue
                picture: (_j = (_h = feature.properties) === null || _h === void 0 ? void 0 : _h["picture"]) === null || _j === void 0 ? void 0 : _j.split("?")[0], streetView: (_k = feature.properties) === null || _k === void 0 ? void 0 : _k["GOOGLE_odkaz"], occupancy: occupancy, rentUntil: (_l = feature.properties) === null || _l === void 0 ? void 0 : _l["Doba_najmu"], description: (_m = feature.properties) === null || _m === void 0 ? void 0 : _m["Poznamka"], approximateArea: (_o = feature.properties) === null || _o === void 0 ? void 0 : _o["Orientacna_vymera_v_m2"], approximateRentPricePerYear: (_p = feature.properties) === null || _p === void 0 ? void 0 : _p["orientacna_cena_najmu_za_rok"], linkNZ: (_q = feature.properties) === null || _q === void 0 ? void 0 : _q["Odkaz_NZ"], color: color, street: street, competition: competition }) });
    })));
    var uniqueOccupancies = (0, utils_1.getUniqueValuesFromFeatures)(data.features, "occupancy");
    var uniquePurposes = (0, utils_1.getUniqueValuesFromFeatures)(data.features, "purpose")
        .sort()
        .filter(function (p) { return p !== "iné"; })
        .concat(["iné"]);
    var uniqueStreets = (0, utils_1.getUniqueValuesFromFeatures)(data.features, "street");
    var uniqueDistricts = (0, utils_1.getUniqueValuesFromFeatures)(data.features, "district").sort(function (a, b) { var _a; return (_a = react_maps_1.DISTRICTS.findIndex(function (d) { return d == a; }) - react_maps_1.DISTRICTS.findIndex(function (d) { return d == b; })) !== null && _a !== void 0 ? _a : 0; });
    return {
        data: data,
        uniqueDistricts: uniqueDistricts,
        uniqueOccupancies: uniqueOccupancies,
        uniquePurposes: uniquePurposes,
        uniqueStreets: uniqueStreets
    };
};
exports.processData = processData;
