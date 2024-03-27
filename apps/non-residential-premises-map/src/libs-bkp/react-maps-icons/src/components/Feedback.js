"use strict";
exports.__esModule = true;
exports.Feedback = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var Feedback = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className;
    var _d = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _d.strokeWidth, size = _d.size, style = _d.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M9.1,15.4L9.1,15.4c0.8,0,1.5,0.3,2.1,0.8c0.5,0.5,0.8,1.3,0.8,2v0.4H1.7v-0.4c0-0.8,0.3-1.5,0.8-2c0.5-0.5,1.2-0.8,2-0.8h0.1"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M9.9,11.3c0.2,0.1,0.4,0.1,0.6,0.1h2.2c0,0.4,0,0.8-0.2,1.1c-0.1,0.2-0.2,0.4-0.4,0.6c-0.1,0.1-0.3,0.2-0.5,0.3c-0.1,0-0.1,0.1-0.2,0.1c0,0.1-0.1,0.1-0.1,0.2c0,0.1,0,0.2,0.1,0.2c0,0.1,0.1,0.1,0.2,0.1c0.1,0,0.2,0,0.2,0c0.3,0,0.6-0.1,0.8-0.2c0.3-0.2,0.6-0.4,0.9-0.7c0.5-0.5,0.8-1.2,0.9-1.9h1.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4V4c0-0.5-0.2-1-0.6-1.4C17.1,2.2,16.6,2,16.1,2h-5.6c-0.5,0-1,0.2-1.4,0.6C8.8,2.9,8.6,3.4,8.6,4v2.6"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M9.8,9.3c0,0.1,0,0.2,0,0.3v3.7c0,0.8-0.3,1.6-0.9,2.2c-0.6,0.6-1.3,0.9-2.1,0.9c-0.8,0-1.6-0.3-2.1-0.9c-0.6-0.6-0.9-1.4-0.9-2.2V9.6c0-0.1,0-0.2,0-0.3"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M5.9,12.7V11"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M7.8,12.7V11"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M13.3,9.3V7.9"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M13.3,7V4"/>
        <path strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" d="M5.6,5.9c0.4,0,0.8,0.1,1.2,0.2c0.4,0.2,0.7,0.4,1,0.8c0.3-0.2,0.7-0.3,1.1-0.3C9.2,6.6,9.7,6.7,10,7c0.3,0.3,0.5,0.7,0.5,1.1l0,0c0,0.8-0.7,1.4-1.6,1.4H4.8c-0.9,0-1.6-0.6-1.6-1.4C3.2,6.9,4.2,5.9,5.6,5.9z"/>
      </svg>
    </div>);
};
exports.Feedback = Feedback;
