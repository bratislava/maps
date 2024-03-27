"use strict";
exports.__esModule = true;
exports.Location = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var Location = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className, isActive = _a.isActive;
    var _d = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _d.strokeWidth, size = _d.size, style = _d.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M10,16.8c3.6,0,6.6-2.9,6.6-6.6S13.6,3.6,10,3.6s-6.6,2.9-6.6,6.6S6.4,16.8,10,16.8z"/>
        <path strokeWidth={strokeWidth} fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeLinecap="round" d="M10,12.3c1.1,0,2.1-0.9,2.1-2.1S11.1,8.1,10,8.1c-1.1,0-2.1,0.9-2.1,2.1S8.9,12.3,10,12.3z"/>
        <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M10,1.4v2.2"/>
        <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M10,16.8V19"/>
        <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M1.2,10.2h2.2"/>
        <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M16.6,10.2h2.2"/>
      </svg>
    </div>);
};
exports.Location = Location;
