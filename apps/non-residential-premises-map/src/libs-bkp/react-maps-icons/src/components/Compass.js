"use strict";
exports.__esModule = true;
exports.Compass = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var Compass = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className;
    var _d = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _d.strokeWidth, size = _d.size, style = _d.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        <path strokeWidth={strokeWidth} fill="currentColor" stroke="currentColor" strokeLinecap="round" d="M13,10.1l-3-8.9l-3,8.9H13z"/>
        <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M7,10.1l3,8.9l3-8.9"/>
      </svg>
    </div>);
};
exports.Compass = Compass;
