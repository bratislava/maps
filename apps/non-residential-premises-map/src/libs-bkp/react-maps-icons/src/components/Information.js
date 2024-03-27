"use strict";
exports.__esModule = true;
exports.Information = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var Information = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className;
    var _d = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _d.strokeWidth, size = _d.size, style = _d.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        <circle strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" cx="9" cy="9.5" r="7.6"/>
        <line strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" x1="9" y1="9" x2="9" y2="12"/>
        <circle fill="currentColor" cx="9" cy="5.7" r="0.8"/>
      </svg>
    </div>);
};
exports.Information = Information;
