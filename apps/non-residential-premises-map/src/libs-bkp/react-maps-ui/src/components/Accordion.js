"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.Accordion = void 0;
var react_accordion_1 = require("@radix-ui/react-accordion");
var classnames_1 = require("classnames");
var Accordion = function (_a) {
    var children = _a.children, className = _a.className, rest = __rest(_a, ["children", "className"]);
    return (<react_accordion_1.Root className={(0, classnames_1["default"])("flex flex-col", className)} {...rest}>
      {children}
    </react_accordion_1.Root>);
};
exports.Accordion = Accordion;
exports["default"] = exports.Accordion;
