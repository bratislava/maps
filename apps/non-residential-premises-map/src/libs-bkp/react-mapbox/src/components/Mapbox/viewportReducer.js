"use strict";
exports.__esModule = true;
exports.viewportReducer = exports.areViewportsSame = exports.mergePartialViewports = exports.mergeViewports = exports.ViewportActionKind = void 0;
var ViewportActionKind;
(function (ViewportActionKind) {
    ViewportActionKind["Change"] = "Change";
})(ViewportActionKind = exports.ViewportActionKind || (exports.ViewportActionKind = {}));
var mergeViewports = function (viewport, partialViewport) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return ({
        zoom: (_a = partialViewport.zoom) !== null && _a !== void 0 ? _a : viewport.zoom,
        pitch: (_b = partialViewport.pitch) !== null && _b !== void 0 ? _b : viewport.pitch,
        bearing: (_c = partialViewport.bearing) !== null && _c !== void 0 ? _c : viewport.bearing,
        center: {
            lat: (_e = (_d = partialViewport.center) === null || _d === void 0 ? void 0 : _d.lat) !== null && _e !== void 0 ? _e : viewport.center.lat,
            lng: (_g = (_f = partialViewport.center) === null || _f === void 0 ? void 0 : _f.lng) !== null && _g !== void 0 ? _g : viewport.center.lng
        },
        padding: {
            top: (_j = (_h = partialViewport.padding) === null || _h === void 0 ? void 0 : _h.top) !== null && _j !== void 0 ? _j : viewport.padding.top,
            right: (_l = (_k = partialViewport.padding) === null || _k === void 0 ? void 0 : _k.right) !== null && _l !== void 0 ? _l : viewport.padding.right,
            bottom: (_o = (_m = partialViewport.padding) === null || _m === void 0 ? void 0 : _m.bottom) !== null && _o !== void 0 ? _o : viewport.padding.bottom,
            left: (_q = (_p = partialViewport.padding) === null || _p === void 0 ? void 0 : _p.left) !== null && _q !== void 0 ? _q : viewport.padding.left
        }
    });
};
exports.mergeViewports = mergeViewports;
var mergePartialViewports = function (firstViewport, secondViewport) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    return ({
        zoom: (_a = secondViewport.zoom) !== null && _a !== void 0 ? _a : firstViewport.zoom,
        pitch: (_b = secondViewport.pitch) !== null && _b !== void 0 ? _b : firstViewport.pitch,
        bearing: (_c = secondViewport.bearing) !== null && _c !== void 0 ? _c : firstViewport.bearing,
        center: {
            lat: (_e = (_d = secondViewport.center) === null || _d === void 0 ? void 0 : _d.lat) !== null && _e !== void 0 ? _e : (_f = firstViewport.center) === null || _f === void 0 ? void 0 : _f.lat,
            lng: (_h = (_g = secondViewport.center) === null || _g === void 0 ? void 0 : _g.lng) !== null && _h !== void 0 ? _h : (_j = firstViewport.center) === null || _j === void 0 ? void 0 : _j.lng
        },
        padding: {
            top: (_l = (_k = secondViewport.padding) === null || _k === void 0 ? void 0 : _k.top) !== null && _l !== void 0 ? _l : (_m = firstViewport.padding) === null || _m === void 0 ? void 0 : _m.top,
            right: (_p = (_o = secondViewport.padding) === null || _o === void 0 ? void 0 : _o.right) !== null && _p !== void 0 ? _p : (_q = firstViewport.padding) === null || _q === void 0 ? void 0 : _q.right,
            bottom: (_s = (_r = secondViewport.padding) === null || _r === void 0 ? void 0 : _r.bottom) !== null && _s !== void 0 ? _s : (_t = firstViewport.padding) === null || _t === void 0 ? void 0 : _t.bottom,
            left: (_v = (_u = secondViewport.padding) === null || _u === void 0 ? void 0 : _u.left) !== null && _v !== void 0 ? _v : (_w = firstViewport.padding) === null || _w === void 0 ? void 0 : _w.left
        }
    });
};
exports.mergePartialViewports = mergePartialViewports;
var areViewportsSame = function (firstViewport, secondViewport) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
    var isZoomSame = Math.round(((_a = firstViewport.zoom) !== null && _a !== void 0 ? _a : 0) * 100) ===
        Math.round(((_b = secondViewport.zoom) !== null && _b !== void 0 ? _b : 0) * 100);
    var isPitchSame = Math.round(((_c = firstViewport.pitch) !== null && _c !== void 0 ? _c : 0) * 100) ===
        Math.round(((_d = secondViewport.pitch) !== null && _d !== void 0 ? _d : 0) * 100);
    var isBearingSame = Math.round(((_e = firstViewport.bearing) !== null && _e !== void 0 ? _e : 0) * 100) ===
        Math.round(((_f = secondViewport.bearing) !== null && _f !== void 0 ? _f : 0) * 100);
    var isPaddingTopSame = Math.round((_h = (_g = firstViewport.padding) === null || _g === void 0 ? void 0 : _g.top) !== null && _h !== void 0 ? _h : 0) ===
        Math.round((_k = (_j = secondViewport.padding) === null || _j === void 0 ? void 0 : _j.top) !== null && _k !== void 0 ? _k : 0);
    var isPaddingRightSame = Math.round((_m = (_l = firstViewport.padding) === null || _l === void 0 ? void 0 : _l.right) !== null && _m !== void 0 ? _m : 0) ===
        Math.round((_p = (_o = secondViewport.padding) === null || _o === void 0 ? void 0 : _o.right) !== null && _p !== void 0 ? _p : 0);
    var isPaddingBottomSame = Math.round((_r = (_q = firstViewport.padding) === null || _q === void 0 ? void 0 : _q.bottom) !== null && _r !== void 0 ? _r : 0) ===
        Math.round((_t = (_s = secondViewport.padding) === null || _s === void 0 ? void 0 : _s.bottom) !== null && _t !== void 0 ? _t : 0);
    var isPaddingLeftSame = Math.round((_v = (_u = firstViewport.padding) === null || _u === void 0 ? void 0 : _u.left) !== null && _v !== void 0 ? _v : 0) ===
        Math.round((_x = (_w = secondViewport.padding) === null || _w === void 0 ? void 0 : _w.left) !== null && _x !== void 0 ? _x : 0);
    var isPaddingSame = isPaddingTopSame &&
        isPaddingRightSame &&
        isPaddingBottomSame &&
        isPaddingLeftSame;
    var isLatSame = Math.round(((_z = (_y = firstViewport.center) === null || _y === void 0 ? void 0 : _y.lat) !== null && _z !== void 0 ? _z : 0) * 100000) ===
        Math.round(((_1 = (_0 = secondViewport.center) === null || _0 === void 0 ? void 0 : _0.lat) !== null && _1 !== void 0 ? _1 : 0) * 100000);
    var isLngSame = Math.round(((_3 = (_2 = firstViewport.center) === null || _2 === void 0 ? void 0 : _2.lng) !== null && _3 !== void 0 ? _3 : 0) * 100000) ===
        Math.round(((_5 = (_4 = secondViewport.center) === null || _4 === void 0 ? void 0 : _4.lng) !== null && _5 !== void 0 ? _5 : 0) * 100000);
    var isCenterSame = isLatSame && isLngSame;
    return (isZoomSame && isPitchSame && isBearingSame && isPaddingSame && isCenterSame);
};
exports.areViewportsSame = areViewportsSame;
var viewportReducer = function (viewport, action) {
    switch (action.type) {
        case ViewportActionKind.Change:
            return (0, exports.mergeViewports)(viewport, action.partialViewport);
    }
};
exports.viewportReducer = viewportReducer;
