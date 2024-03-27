"use strict";
exports.__esModule = true;
exports.lte = void 0;
var lte = function (exp, f, evaluate) {
    var _a;
    var _b = exp.slice(1), propertyName = _b[0], subExp = _b[1];
    var propertyValue = (_a = f.properties) === null || _a === void 0 ? void 0 : _a[propertyName];
    var subExpValue = evaluate(subExp, f);
    if (typeof propertyValue !== typeof subExpValue) {
        return false;
    }
    if (propertyValue > subExpValue) {
        return false;
    }
    return true;
};
exports.lte = lte;
