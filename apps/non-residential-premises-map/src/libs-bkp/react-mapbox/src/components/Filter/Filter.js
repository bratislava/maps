"use strict";
exports.__esModule = true;
exports.Filter = exports.filterContext = void 0;
var mapbox_expressions_1 = require("@bratislava/mapbox-expressions");
var react_1 = require("react");
exports.filterContext = (0, react_1.createContext)({
    expression: []
});
var Filter = function (_a) {
    var _b = _a.expression, expression = _b === void 0 ? [] : _b, children = _a.children;
    var isFeatureVisible = (0, react_1.useCallback)(function (feature) {
        var result = (0, mapbox_expressions_1.evaluate)(expression, feature);
        return !!result;
    }, [expression]);
    var filterContextValue = (0, react_1.useMemo)(function () {
        return {
            expression: expression,
            isFeatureVisible: isFeatureVisible
        };
    }, [expression, isFeatureVisible]);
    return (<exports.filterContext.Provider value={filterContextValue}>
      {children}
    </exports.filterContext.Provider>);
};
exports.Filter = Filter;
