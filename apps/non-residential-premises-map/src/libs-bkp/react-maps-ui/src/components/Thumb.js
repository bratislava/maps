"use strict";
exports.__esModule = true;
exports.Thumb = void 0;
var react_1 = require("react");
var react_aria_1 = require("react-aria");
var classnames_1 = require("classnames");
var framer_motion_1 = require("framer-motion");
var Thumb = function (props) {
    var state = props.state, trackRef = props.trackRef, index = props.index, _a = props.isActive, isActive = _a === void 0 ? false : _a;
    var inputRef = (0, react_1.useRef)(null);
    var _b = (0, react_aria_1.useSliderThumb)({
        index: index,
        trackRef: trackRef,
        inputRef: inputRef
    }, state), thumbProps = _b.thumbProps, inputProps = _b.inputProps, isDragging = _b.isDragging;
    var _c = (0, react_aria_1.useFocusRing)(), focusProps = _c.focusProps, isFocusVisible = _c.isFocusVisible;
    return (<div {...thumbProps}>
      <framer_motion_1.motion.div className={(0, classnames_1["default"])("w-4 h-4 rounded-full bg-gray-lightmode dark:bg-gray-darkmode hover:bg-primary dark:hover:bg-primary cursor-grab active:cursor-grabbing", {
            "outline outline-primary outline-2 outline-offset-2": isFocusVisible,
            "bg-primary dark:bg-primary": isDragging || isActive
        })}/>
      <react_aria_1.VisuallyHidden>
        <input ref={inputRef} {...(0, react_aria_1.mergeProps)(inputProps, focusProps)}/>
      </react_aria_1.VisuallyHidden>
    </div>);
};
exports.Thumb = Thumb;
