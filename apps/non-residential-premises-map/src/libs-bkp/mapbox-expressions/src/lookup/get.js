"use strict";
exports.__esModule = true;
exports.get = void 0;
var get = function (exp, f, evaluate) {
    var _a, _b;
    var subExp = exp.slice(1)[0];
    var result = evaluate(subExp, f);
    return (_b = (_a = f.properties) === null || _a === void 0 ? void 0 : _a[result]) !== null && _b !== void 0 ? _b : null;
};
exports.get = get;
