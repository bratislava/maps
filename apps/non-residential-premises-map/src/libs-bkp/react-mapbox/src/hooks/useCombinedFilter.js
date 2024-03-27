"use strict";
exports.__esModule = true;
exports.useCombinedFilter = void 0;
var react_1 = require("react");
var useCombinedFilter = function (_a) {
    var combiner = _a.combiner, filters = _a.filters;
    var areDefault = (0, react_1.useMemo)(function () {
        return filters
            .filter(function (f) { return !f.onlyInExpression; })
            .every(function (f) { return f.filter.areDefault; });
    }, [filters]);
    var reset = (0, react_1.useCallback)(function () {
        filters.forEach(function (f) { return !f.onlyInExpression && f.filter.reset(); });
    }, [filters]);
    var expression = (0, react_1.useMemo)(function () {
        var exp = [combiner];
        filters.forEach(function (f) {
            if (f.filter.expression && f.filter.expression.length)
                exp.push(f.filter.expression);
        });
        return exp;
    }, [combiner, filters]);
    var active = (0, react_1.useMemo)(function () {
        return filters
            .filter(function (f) { return !f.onlyInExpression; })
            .map(function (f) { return f.mapToActive(f.filter.activeKeys); });
    }, [filters]);
    return {
        expression: expression,
        active: active,
        areDefault: areDefault,
        reset: reset
    };
};
exports.useCombinedFilter = useCombinedFilter;
