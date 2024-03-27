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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.useArcgisAttachments = exports.useArcgis = exports.fetchAttachmentsFromArcgis = exports.fetchAllFromArcgis = exports.fetchCount = exports.fetchFromArcgis = void 0;
var react_1 = require("react");
var fetchFromArcgis = function (url, _a) {
    var offset = _a.offset, count = _a.count, format = _a.format;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, fetch([
                    "".concat(url, "/query?where=1=1"),
                    "&outFields=*",
                    "&returnGeometry=true",
                    "&featureEncoding=esriDefault",
                    offset ? "&resultOffset=".concat(offset) : "",
                    count ? "&resultRecordCount=".concat(count) : "",
                    format ? "&f=".concat(format) : "&f=pgeojson",
                ].join("")).then(function (res) { return res.json(); })];
        });
    });
};
exports.fetchFromArcgis = fetchFromArcgis;
var fetchCount = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var res, json;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetch([
                    "".concat(url, "/query?where=1=1"),
                    "featureEncoding=esriDefault",
                    "returnCountOnly=true",
                    "f=pjson",
                ].join("&"))];
            case 1:
                res = _b.sent();
                return [4 /*yield*/, res.json()];
            case 2:
                json = _b.sent();
                return [2 /*return*/, (_a = json.count) !== null && _a !== void 0 ? _a : 0];
        }
    });
}); };
exports.fetchCount = fetchCount;
var DEFAULT_OPTIONS = {
    countPerRequest: 1000,
    pagination: true,
    format: "pgeojson"
};
var fetchAllFromArcgis = function (url, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var GLOBAL_FEATURE_ID, features, ops, totalCount, requestCount, chunks, data;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            GLOBAL_FEATURE_ID = 0;
                            features = [];
                            ops = options
                                ? __assign(__assign({}, DEFAULT_OPTIONS), options) : DEFAULT_OPTIONS;
                            if (!ops.pagination) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, exports.fetchCount)(url)];
                        case 1:
                            totalCount = _c.sent();
                            requestCount = (_b = Math.ceil(totalCount / ((_a = ops.countPerRequest) !== null && _a !== void 0 ? _a : 1000))) !== null && _b !== void 0 ? _b : 1;
                            return [4 /*yield*/, Promise.all(Array(requestCount)
                                    .fill(null)
                                    .map(function (chunk, index) { return __awaiter(void 0, void 0, void 0, function () {
                                    var offset, count, format, data;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                offset = ((_a = ops.countPerRequest) !== null && _a !== void 0 ? _a : 1000) * index;
                                                count = ops.countPerRequest;
                                                format = ops.format;
                                                return [4 /*yield*/, (0, exports.fetchFromArcgis)(url, { offset: offset, count: count, format: format })];
                                            case 1:
                                                data = _b.sent();
                                                return [2 /*return*/, data.features];
                                        }
                                    });
                                }); }))];
                        case 2:
                            chunks = _c.sent();
                            // filter out features which don't have geometry for some reason
                            features = chunks
                                .flat()
                                .filter(function (feature) { return feature.geometry; })
                                .map(function (feature) {
                                GLOBAL_FEATURE_ID++;
                                return __assign(__assign({}, feature), { id: GLOBAL_FEATURE_ID });
                            });
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, (0, exports.fetchFromArcgis)(url, { format: ops.format })];
                        case 4:
                            data = _c.sent();
                            features = data.features;
                            _c.label = 5;
                        case 5:
                            resolve({
                                type: "FeatureCollection",
                                features: features
                            });
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.fetchAllFromArcgis = fetchAllFromArcgis;
var fetchAttachmentsFromArcgis = function (serverUrl, objectId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var res, json;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch("".concat(serverUrl, "/").concat(objectId, "/attachments/?f=pjson"))];
                        case 1:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            json = _a.sent();
                            resolve(json.attachmentInfos);
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.fetchAttachmentsFromArcgis = fetchAttachmentsFromArcgis;
var useArcgis = function (url, options) {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    (0, react_1.useEffect)(function () {
        if (Array.isArray(url)) {
            Promise.all(url.map(function (u) { return (0, exports.fetchAllFromArcgis)(u, options); })).then(function (results) {
                setData({
                    type: "FeatureCollection",
                    features: results.reduce(function (features, result) { return __spreadArray(__spreadArray([], features, true), result.features, true); }, [])
                });
            });
        }
        else {
            (0, exports.fetchAllFromArcgis)(url, options).then(function (fetchedData) {
                setData(fetchedData);
            });
        }
    }, [url]);
    return {
        data: data
    };
};
exports.useArcgis = useArcgis;
var useArcgisAttachments = function (url, objectId) {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    (0, react_1.useEffect)(function () {
        setData(null);
        if (objectId) {
            (0, exports.fetchAttachmentsFromArcgis)(url, objectId).then(function (fetchedData) {
                setData(fetchedData);
            });
        }
    }, [url, objectId]);
    return { data: data };
};
exports.useArcgisAttachments = useArcgisAttachments;
