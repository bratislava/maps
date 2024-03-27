"use strict";
exports.__esModule = true;
exports.Fullscreen = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var Fullscreen = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className, _d = _a.isFullscreen, isFullscreen = _d === void 0 ? false : _d;
    var _e = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _e.strokeWidth, size = _e.size, style = _e.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        {!isFullscreen ? (<>
            <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M2.8,17L17.1,2.7"/>
            <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M17,7.3l0.1-4.5l-4.5,0.1"/>
            <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M2.9,12.5L2.8,17l4.5-0.1"/>
          </>) : (<>
            <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M8.2,11.8l-5.6,5.6"/>
            <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M8.1,16.3l0.1-4.5l-4.5,0.1"/>
            <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M11.8,8.2l5.6-5.6"/>
            <path strokeWidth={strokeWidth} fill="none" stroke="currentColor" strokeLinecap="round" d="M11.9,3.7l-0.1,4.5l4.5-0.1"/>
          </>)}
      </svg>
    </div>);
};
exports.Fullscreen = Fullscreen;
