"use strict";
exports.__esModule = true;
exports.Eye = void 0;
var useIconParams_1 = require("../hooks/useIconParams");
var framer_motion_1 = require("framer-motion");
var Eye = function (_a) {
    var _b = _a.size, inputSize = _b === void 0 ? "default" : _b, _c = _a.direction, direction = _c === void 0 ? "top" : _c, className = _a.className, _d = _a.isCrossed, isCrossed = _d === void 0 ? false : _d;
    var _e = (0, useIconParams_1.useIconParams)(inputSize, direction), strokeWidth = _e.strokeWidth, size = _e.size, style = _e.style;
    return (<div className={className}>
      <svg style={style} width={size} height={size} viewBox={"0 0 20 20"} fill="none">
        <path d="M 1.59 10.054 C 1.74 10.26 5.332 15.103 9.919 15.103 C 14.509 15.103 18.1 10.26 18.251 10.054 C 18.394 9.857 18.394 9.592 18.251 9.396 C 18.1 9.192 14.509 4.346 9.919 4.346 C 5.332 4.346 1.74 9.192 1.59 9.396 C 1.447 9.592 1.447 9.857 1.59 10.054 Z" strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round"/>
        <path d="M 9.826 12.972 C 11.617 12.972 13.072 11.515 13.072 9.725 C 13.072 7.934 11.617 6.477 9.826 6.477 C 8.036 6.477 6.578 7.934 6.578 9.725 C 6.578 11.515 8.036 12.972 9.826 12.972 Z" strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round"/>
        <framer_motion_1.motion.path animate={{
            pathLength: isCrossed ? 1 : 0,
            opacity: isCrossed ? 1 : 0
        }} d="M 2.537 14.198 L 17.546 5.454" strokeWidth={strokeWidth} stroke="currentColor"/>
      </svg>
    </div>);
};
exports.Eye = Eye;
