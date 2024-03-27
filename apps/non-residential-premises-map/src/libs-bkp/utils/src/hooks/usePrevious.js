"use strict";
exports.__esModule = true;
exports.usePrevious = void 0;
var react_1 = require("react");
var usePrevious = function (value) {
    var ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        ref.current = value;
    });
    return ref.current;
};
exports.usePrevious = usePrevious;
