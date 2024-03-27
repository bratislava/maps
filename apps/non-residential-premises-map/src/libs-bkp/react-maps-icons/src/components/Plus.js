"use strict";
exports.__esModule = true;
exports.Plus = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var Plus = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className;
    var _d = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _d.strokeWidth, size = _d.size, style = _d.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        <line strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" x1="2" y1="10" x2="18" y2="10"/>
        <line strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" x1="10" y1="18" x2="10" y2="2"/>
      </svg>
    </div>);
};
exports.Plus = Plus;
