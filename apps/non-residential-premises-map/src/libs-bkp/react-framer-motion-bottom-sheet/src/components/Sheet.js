"use strict";
exports.__esModule = true;
exports.Sheet = exports.sheetContext = void 0;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var framer_motion_1 = require("framer-motion");
var react_resize_detector_1 = require("react-resize-detector");
var getClosestSnapPoint_1 = require("../utils/getClosestSnapPoint");
var utils_1 = require("@bratislava/utils");
exports.sheetContext = (0, react_1.createContext)({
    isOpen: false,
    currentHeight: 0
});
exports.Sheet = (0, react_1.forwardRef)(function (_a, forwardedRef) {
    var _b = _a.isOpen, isOpen = _b === void 0 ? false : _b, snapPoints = _a.snapPoints, _c = _a.defaultSnapPoint, defaultSnapPoint = _c === void 0 ? 0 : _c, children = _a.children, onClose = _a.onClose, className = _a.className, onSnapChange = _a.onSnapChange, _d = _a.hideHeader, hideHeader = _d === void 0 ? false : _d;
    var previousOpen = (0, utils_1.usePrevious)(isOpen);
    // Children full height
    var _e = (0, react_resize_detector_1.useResizeDetector)(), _f = _e.height, innerHeight = _f === void 0 ? 0 : _f, innerRef = _e.ref;
    var previousInnerHeight = (0, utils_1.usePrevious)(innerHeight);
    // Screen height
    var _g = (0, react_resize_detector_1.useResizeDetector)(), screenRef = _g.ref, _h = _g.height, screenHeight = _h === void 0 ? window.innerHeight : _h;
    var _j = (0, react_1.useState)(defaultSnapPoint), currentSnapIndex = _j[0], setCurrentSnapIndex = _j[1];
    var mergedSnapPoints = (0, react_1.useMemo)(function () { return snapPoints !== null && snapPoints !== void 0 ? snapPoints : ['content']; }, [snapPoints]);
    // All snappoints recalculated to absolute numbers
    var absoluteSnapPoints = (0, react_1.useMemo)(function () {
        return mergedSnapPoints.map(function (sp) {
            if (typeof sp === 'number')
                return Math.min(sp, screenHeight);
            if (sp === 'content')
                return Math.min(innerHeight, screenHeight);
            if (typeof sp === 'string')
                return Math.min((screenHeight * parseInt(sp.split('%')[0])) / 100, screenHeight);
            else
                return 0;
        });
    }, [innerHeight, mergedSnapPoints, screenHeight]);
    var animation = (0, framer_motion_1.useAnimation)();
    var _k = (0, react_1.useState)(0), y = _k[0], setY = _k[1];
    var animateTo = (0, react_1.useCallback)(function (value) {
        var constrainedValue = Math.min(Math.max(innerHeight, screenHeight), value);
        animation.start({ y: -constrainedValue });
        setY(constrainedValue);
    }, [animation, innerHeight, screenHeight]);
    var isScrollable = (0, react_1.useMemo)(function () {
        return innerHeight > screenHeight;
    }, [innerHeight, screenHeight]);
    var snapTo = (0, react_1.useCallback)(function (index) {
        var _a;
        animateTo((_a = absoluteSnapPoints[index]) !== null && _a !== void 0 ? _a : 0);
        setCurrentSnapIndex(index);
    }, [absoluteSnapPoints, animateTo]);
    var onDragEnd = (0, react_1.useCallback)(function (event, info) {
        var resultY = y - info.offset.y - info.velocity.y / 5;
        if (isScrollable && resultY > screenHeight) {
            animateTo(resultY);
            return;
        }
        // Calculate nearest snapPoint
        var closestSnapPointIndex = (0, getClosestSnapPoint_1.getClosestSnapPoint)(absoluteSnapPoints, resultY).index;
        // animateTo(closestSnapPointHeight);
        snapTo(closestSnapPointIndex);
    }, [y, isScrollable, screenHeight, absoluteSnapPoints, snapTo, animateTo]);
    (0, react_1.useEffect)(function () {
        var _a;
        onSnapChange &&
            onSnapChange({
                snapIndex: currentSnapIndex,
                snapHeight: (_a = absoluteSnapPoints[currentSnapIndex]) !== null && _a !== void 0 ? _a : 0
            });
    }, [currentSnapIndex, onSnapChange, absoluteSnapPoints]);
    (0, react_1.useEffect)(function () {
        if (isOpen && innerHeight !== previousInnerHeight) {
            snapTo(currentSnapIndex);
        }
    }, [isOpen, innerHeight, previousInnerHeight, currentSnapIndex, snapTo]);
    var handleOpen = (0, react_1.useCallback)(function () {
        snapTo(defaultSnapPoint);
    }, [snapTo, defaultSnapPoint]);
    var handleClose = (0, react_1.useCallback)(function () {
        animateTo(0);
        onClose && onClose();
    }, [animateTo, onClose]);
    (0, react_1.useEffect)(function () {
        if (!previousOpen && isOpen)
            handleOpen();
        if (previousOpen && !isOpen)
            handleClose();
    }, [isOpen, handleOpen, handleClose, previousOpen]);
    var sheetContextValue = (0, react_1.useMemo)(function () { return ({
        isOpen: false,
        currentHeight: y
    }); }, [y]);
    (0, react_1.useImperativeHandle)(forwardedRef, function () { return ({
        snapTo: snapTo
    }); }, [snapTo]);
    return (0, react_dom_1.createPortal)(<exports.sheetContext.Provider value={sheetContextValue}>
        <div ref={screenRef} style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 50,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }}></div>
        {/* <div
          style={{
            position: 'fixed',
            zIndex: 10,
            left: 0,
            bottom: resultDebugY,
            height: 1,
            width: '100vw',
            background: 'blue',
          }}
        />
        {absoluteSnapPoints.map((sp, index) => (
          <div
            key={index}
            style={{
              position: 'fixed',
              zIndex: 10,
              left: 0,
              bottom: sp - 1,
              height: 1,
              width: '100vw',
              background: 'red',
            }}
          />
        ))} */}
        <framer_motion_1.motion.div dragConstraints={{
            bottom: 0,
            top: Math.min(-screenHeight, -innerHeight)
        }} animate={animation} transition={{ ease: 'easeOut', duration: 0.5 }} drag="y" style={{
            position: 'fixed',
            left: 0,
            top: screenHeight,
            width: '100vw',
            paddingBottom: screenHeight * 2
        }} onDragEnd={onDragEnd} className={className}>
          <div ref={innerRef}>{children}</div>
        </framer_motion_1.motion.div>
      </exports.sheetContext.Provider>, document.body);
});
exports.Sheet.displayName = 'Sheet';
