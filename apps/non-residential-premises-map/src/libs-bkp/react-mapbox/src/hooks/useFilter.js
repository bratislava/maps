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
exports.useFilter = void 0;
var react_1 = require("react");
var defaultComparator = function (_a) {
    var value = _a.value, property = _a.property;
    return [
        '==',
        property,
        value,
    ];
};
var useFilter = function (_a) {
    var property = _a.property, keys = _a.keys, defaultValues = _a.defaultValues, _b = _a.comparator, comparator = _b === void 0 ? defaultComparator : _b, _c = _a.combiner, combiner = _c === void 0 ? 'any' : _c;
    var _d = (0, react_1.useState)(null), expression = _d[0], setExpression = _d[1];
    var _e = (0, react_1.useState)([]), keepOnEmptyExpression = _e[0], setKeepOnEmptyExpression = _e[1];
    var _f = (0, react_1.useState)({}), valuesObject = _f[0], setValuesObject = _f[1];
    var _g = (0, react_1.useState)({}), defaultValuesObject = _g[0], setDefaultValuesObject = _g[1];
    (0, react_1.useEffect)(function () {
        setDefaultValuesObject(keys.reduce(function (prev, key) {
            var _a;
            prev[key] = (_a = defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues[key]) !== null && _a !== void 0 ? _a : false;
            return prev;
        }, {}));
    }, [defaultValues, keys]);
    (0, react_1.useEffect)(function () {
        var activeKeys = keys.filter(function (key) { return valuesObject[key]; });
        setExpression(activeKeys.length
            ? __spreadArray([
                combiner
            ], activeKeys.map(function (key) { return comparator({ value: key, property: property }); }), true) : null);
        setKeepOnEmptyExpression(__spreadArray([
            combiner
        ], activeKeys.map(function (key) { return comparator({ value: key, property: property }); }), true));
    }, [comparator, combiner, property, keys, valuesObject]);
    var values = (0, react_1.useMemo)(function () {
        return keys.map(function (key) { return ({ key: key, isActive: valuesObject[key] }); });
    }, [keys, valuesObject]);
    var activeKeys = (0, react_1.useMemo)(function () { return keys.filter(function (key) { return valuesObject[key]; }); }, [keys, valuesObject]);
    var areDefault = (0, react_1.useMemo)(function () { return JSON.stringify(valuesObject) === JSON.stringify(defaultValuesObject); }, [valuesObject, defaultValuesObject]);
    var setActive = (0, react_1.useCallback)(function (inputKeys, value) {
        if (value === void 0) { value = true; }
        if (Array.isArray(inputKeys)) {
            setValuesObject(function (valuesObject) { return (__assign(__assign({}, valuesObject), inputKeys.reduce(function (prev, key) {
                prev[key] = value;
                return prev;
            }, {}))); });
        }
        else {
            setValuesObject(function (valuesObject) {
                var _a;
                return (__assign(__assign({}, valuesObject), (_a = {}, _a[inputKeys] = value, _a)));
            });
        }
    }, []);
    var setActiveAll = (0, react_1.useCallback)(function (value) {
        if (value === void 0) { value = true; }
        setValuesObject(keys.reduce(function (prev, key) {
            prev[key] = value;
            return prev;
        }, {}));
    }, [keys]);
    var setActiveOnly = (0, react_1.useCallback)(function (activeKeys) {
        setValuesObject(keys.reduce(function (prev, key) {
            var _a;
            prev[key] =
                (_a = (activeKeys === key || (activeKeys === null || activeKeys === void 0 ? void 0 : activeKeys.includes(key)))) !== null && _a !== void 0 ? _a : false;
            return prev;
        }, {}));
    }, [keys]);
    var toggleActive = (0, react_1.useCallback)(function (key) {
        setValuesObject(function (values) {
            var _a;
            return (__assign(__assign({}, values), (_a = {}, _a[key] = !values[key], _a)));
        });
    }, []);
    var reset = (0, react_1.useCallback)(function () {
        setValuesObject(keys.reduce(function (prev, key) {
            var _a;
            prev[key] = (_a = defaultValuesObject === null || defaultValuesObject === void 0 ? void 0 : defaultValuesObject[key]) !== null && _a !== void 0 ? _a : false;
            return prev;
        }, {}));
    }, [keys, defaultValuesObject]);
    (0, react_1.useEffect)(function () {
        reset();
    }, [reset]);
    var isAnyKeyActive = (0, react_1.useCallback)(function (inputKeys) {
        var k = inputKeys !== null && inputKeys !== void 0 ? inputKeys : keys;
        for (var _i = 0, k_1 = k; _i < k_1.length; _i++) {
            var key = k_1[_i];
            if (valuesObject[key])
                return true;
        }
        return false;
    }, [keys, valuesObject]);
    var areKeysActive = (0, react_1.useCallback)(function (keys) {
        if (Array.isArray(keys)) {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (!valuesObject[key])
                    return false;
            }
            return true;
        }
        return !!valuesObject[keys];
    }, [valuesObject]);
    var areKeysInactive = (0, react_1.useCallback)(function (keys) {
        if (Array.isArray(keys)) {
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var key = keys_2[_i];
                if (!valuesObject[key])
                    return true;
            }
            return false;
        }
        return !!valuesObject[keys];
    }, [valuesObject]);
    return {
        expression: expression !== null && expression !== void 0 ? expression : [],
        keepOnEmptyExpression: keepOnEmptyExpression,
        values: values,
        activeKeys: activeKeys,
        keys: keys,
        areDefault: areDefault,
        setActive: setActive,
        setActiveAll: setActiveAll,
        toggleActive: toggleActive,
        reset: reset,
        isAnyKeyActive: isAnyKeyActive,
        areKeysActive: areKeysActive,
        areKeysInactive: areKeysInactive,
        setActiveOnly: setActiveOnly
    };
};
exports.useFilter = useFilter;
