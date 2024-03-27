"use strict";
exports.__esModule = true;
exports.all = void 0;
var all = function (exp, f, evaluate) {
    var subExps = exp.slice(1);
    for (var _i = 0, subExps_1 = subExps; _i < subExps_1.length; _i++) {
        var subExp = subExps_1[_i];
        if (evaluate(subExp, f) !== true)
            return false;
    }
    return true;
};
exports.all = all;
