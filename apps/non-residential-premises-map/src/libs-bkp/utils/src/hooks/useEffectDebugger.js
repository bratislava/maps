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
exports.useEffectDebugger = void 0;
var react_1 = require("react");
var usePrevious_1 = require("./usePrevious");
var useEffectDebugger = function (effectHook, dependencies, dependencyNames, name) {
    if (dependencyNames === void 0) { dependencyNames = []; }
    var previousDeps = (0, usePrevious_1.usePrevious)(dependencies);
    var changedDeps = process.env.NODE_ENV === "development"
        ? dependencies.reduce(function (accum, dependency, index) {
            var _a;
            if (previousDeps && dependency !== previousDeps[index]) {
                var keyName = dependencyNames[index] || index;
                return __assign(__assign({}, accum), (_a = {}, _a[keyName] = {
                    before: previousDeps[index],
                    after: dependency
                }, _a));
            }
            return accum;
        }, {})
        : {};
    // TODO find out how to fix this or if it's even used anymore
    //@ts-ignore
    // if (Object.keys(changedDeps).length && import.meta.env.DEV) {
    //   console.log(name ?? "[use-effect-debugger]", changedDeps);
    // }
    (0, react_1.useEffect)(effectHook, dependencies);
};
exports.useEffectDebugger = useEffectDebugger;
