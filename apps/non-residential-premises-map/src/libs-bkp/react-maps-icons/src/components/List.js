"use strict";
exports.__esModule = true;
exports.List = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var List = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className;
    var _d = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _d.strokeWidth, size = _d.size, style = _d.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M7.6,4.5H18"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M7.6,10.1H18"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M7.6,15.6H18"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M3.3,5.9c0.8,0,1.4-0.6,1.4-1.4S4,3.1,3.3,3.1S1.9,3.8,1.9,4.5S2.5,5.9,3.3,5.9z"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M3.3,11.4c0.8,0,1.4-0.6,1.4-1.4c0-0.8-0.6-1.4-1.4-1.4s-1.4,0.6-1.4,1.4C1.9,10.8,2.5,11.4,3.3,11.4z"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M3.3,17c0.8,0,1.4-0.6,1.4-1.4c0-0.8-0.6-1.4-1.4-1.4s-1.4,0.6-1.4,1.4C1.9,16.4,2.5,17,3.3,17z"/>
      </svg>
    </div>);
};
exports.List = List;
