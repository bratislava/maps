"use strict";
exports.__esModule = true;
exports.useIconParams = void 0;
var react_1 = require("react");
var types_1 = require("../types");
var useIconParams = function (inputSize, direction) {
    var _a = (0, react_1.useState)(0), strokeWidth = _a[0], setStrokeWidth = _a[1];
    var _b = (0, react_1.useState)(0), size = _b[0], setSize = _b[1];
    var _c = (0, react_1.useState)({
        transform: "rotate(0)"
    }), style = _c[0], setStyle = _c[1];
    (0, react_1.useEffect)(function () {
        setStrokeWidth((types_1.DEFAULT_STROKE_SIZE * types_1.SIZES["default"]) / types_1.SIZES[inputSize]);
        setSize(types_1.SIZES[inputSize]);
        setStyle(types_1.DIRECTIONS_STYLES[direction]);
    }, [inputSize, direction]);
    return {
        size: size,
        strokeWidth: strokeWidth,
        style: style
    };
};
exports.useIconParams = useIconParams;
