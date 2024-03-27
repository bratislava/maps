"use strict";
exports.__esModule = true;
exports.evaluate = void 0;
var all_1 = require("./decision/all");
var any_1 = require("./decision/any");
var equals_1 = require("./decision/equals");
var gte_1 = require("./decision/gte");
var lte_1 = require("./decision/lte");
var get_1 = require("./lookup/get");
var in_1 = require("./lookup/in");
var evaluate = function (exp, f) {
    if (Array.isArray(exp)) {
        var key = exp[0];
        switch (key) {
            case "all":
                return (0, all_1.all)(exp, f, exports.evaluate);
            case "any":
                return (0, any_1.any)(exp, f, exports.evaluate);
            case "get":
                return (0, get_1.get)(exp, f, exports.evaluate);
            case "in":
                return (0, in_1.inside)(exp, f, exports.evaluate);
            case "==":
                return (0, equals_1.equals)(exp, f, exports.evaluate);
            case ">=":
                return (0, gte_1.gte)(exp, f, exports.evaluate);
            case "<=":
                return (0, lte_1.lte)(exp, f, exports.evaluate);
        }
    }
    return exp;
};
exports.evaluate = evaluate;
