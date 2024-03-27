"use strict";
exports.__esModule = true;
exports.Themes = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var Themes = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className;
    var _d = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _d.strokeWidth, size = _d.size, style = _d.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M18.1,6.9l-7.8,3c-0.1,0.1-0.3,0.1-0.4,0l-7.8-3c-0.6-0.2-0.6-1.1,0-1.3l7.8-3c0.1-0.1,0.3-0.1,0.4,0l7.8,3C18.6,5.8,18.6,6.7,18.1,6.9z"/>
        <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M14.9,8.1l3.2,1.2c0.6,0.2,0.6,1.1,0,1.3l-7.8,3c-0.1,0.1-0.3,0.1-0.4,0l-7.8-3c-0.6-0.2-0.6-1.1,0-1.3l3.2-1.2"/>
        <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M14.9,11.9l3.2,1.2c0.6,0.2,0.6,1.1,0,1.3l-7.8,3c-0.1,0.1-0.3,0.1-0.4,0l-7.8-3c-0.6-0.2-0.6-1.1,0-1.3l3.2-1.2"/>
      </svg>
    </div>);
};
exports.Themes = Themes;
