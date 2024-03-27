"use strict";
exports.__esModule = true;
exports.Darkmode = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var Darkmode = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className;
    var _d = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _d.strokeWidth, size = _d.size, style = _d.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M10,18c4.4,0,8-3.6,8-8s-3.6-8-8-8s-8,3.6-8,8S5.6,18,10,18z"/>
        <path fill="currentColor" d="M10,2C7.9,2,5.8,2.8,4.3,4.3C2.8,5.8,2,7.9,2,10s0.8,4.2,2.3,5.7C5.8,17.2,7.9,18,10,18V2z"/>
      </svg>
    </div>);
};
exports.Darkmode = Darkmode;
