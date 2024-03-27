"use strict";
exports.__esModule = true;
exports.log = void 0;
var log = function (message, logColor) {
    if (process.env.NODE_ENV === "development") {
        console.log("%c".concat(message), "color: ".concat(logColor === "callback"
            ? "#3b82ed"
            : logColor === "effect"
                ? "#edb418"
                : "black", "; font-weight: bold"));
    }
};
exports.log = log;
