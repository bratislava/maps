"use strict";
exports.__esModule = true;
exports.inside = void 0;
var inside = function (exp, f, evaluate) {
    var keyword = exp[1];
    var array = evaluate(exp[2], f);
    return array.includes(keyword);
};
exports.inside = inside;
