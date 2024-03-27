"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.isDefined = exports.getUniqueValuesFromFeatures = exports.getRandomItemFrom = exports.getSeasonFromDate = void 0;
__exportStar(require("./hooks/usePrevious"), exports);
__exportStar(require("./hooks/useEffectDebugger"), exports);
var getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
};
// jar: marec - jún 20.3. - 20.6:
// leto: jún - september 21.6. - 22.9.
// jeseň: september - december 23.9. - 20.12.
// zima: december - marec 21.12. - 19.3.
var getSeasonFromDate = function (input) {
    var date = new Date(input);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var season = null;
    switch (month) {
        case 1:
        case 2:
            season = "winter";
            break;
        case 3:
            if (day < 20) {
                season = "winter";
            }
            else {
                season = "spring";
            }
            break;
        case 4:
        case 5:
            season = "spring";
            break;
        case 6:
            if (day < 21) {
                season = "spring";
            }
            else {
                season = "summer";
            }
            break;
        case 7:
        case 8:
            season = "summer";
            break;
        case 9:
            if (day < 23) {
                season = "summer";
            }
            else {
                season = "autumn";
            }
            break;
        case 10:
        case 11:
            season = "autumn";
            break;
        case 12:
            if (day < 21) {
                season = "autumn";
            }
            else {
                season = "winter";
            }
            break;
    }
    return season;
};
exports.getSeasonFromDate = getSeasonFromDate;
var getRandomItemFrom = function (items) {
    return Array.isArray(items) ? items[getRandomInt(items.length)] : items;
};
exports.getRandomItemFrom = getRandomItemFrom;
var getUniqueValuesFromFeatures = function (features, property) {
    return features
        .reduce(function (all, current) {
        var values = Array.isArray(current.properties[property])
            ? current.properties[property]
            : [current.properties[property]];
        return values.reduce(function (allCurrent, value) {
            if (allCurrent.includes(value) || typeof value === "undefined") {
                return allCurrent;
            }
            else {
                return __spreadArray(__spreadArray([], allCurrent, true), [value], false);
            }
        }, all);
    }, [])
        .filter(function (f) { return f; });
};
exports.getUniqueValuesFromFeatures = getUniqueValuesFromFeatures;
function isDefined(value) {
    return value !== undefined && value !== null;
}
exports.isDefined = isDefined;
