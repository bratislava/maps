"use strict";
exports.__esModule = true;
exports.Slot = void 0;
var framer_motion_1 = require("framer-motion");
var classnames_1 = require("classnames");
var react_1 = require("react");
var Map_1 = require("../Map/Map");
var usehooks_ts_1 = require("usehooks-ts");
var react_resize_detector_1 = require("react-resize-detector");
var Slot = function (_a) {
    var id = _a.id, children = _a.children, _b = _a.isVisible, isVisible = _b === void 0 ? true : _b, position = _a.position, hidingEdge = _a.hidingEdge, _c = _a.autoPadding, autoPadding = _c === void 0 ? false : _c, className = _a.className, _d = _a.avoidMapboxControls, avoidMapboxControls = _d === void 0 ? false : _d, padding = _a.padding, _e = _a.persistChildrenWhenClosing, persistChildrenWhenClosing = _e === void 0 ? true : _e;
    // Update of children when closing is delayed due animation
    var debouncedVisible = (0, usehooks_ts_1.useDebounce)(isVisible, 10);
    var _f = (0, react_1.useState)(children), persistedChildren = _f[0], setPersistedChildren = _f[1];
    var _g = (0, react_1.useState)(true), isLoading = _g[0], setLoading = _g[1];
    (0, react_1.useEffect)(function () {
        setTimeout(function () {
            setLoading(false);
        }, 200);
    }, []);
    var _h = (0, react_resize_detector_1.useResizeDetector)(), ref = _h.ref, _j = _h.width, width = _j === void 0 ? 0 : _j, _k = _h.height, height = _k === void 0 ? 0 : _k;
    var calculatedHidingEdge = (0, react_1.useMemo)(function () {
        if (!position) {
            return null;
        }
        if (hidingEdge) {
            return hidingEdge;
        }
        if (position.includes('left'))
            return 'left';
        if (position.includes('right'))
            return 'right';
        return position;
    }, [hidingEdge, position]);
    var topPadding = (0, react_1.useMemo)(function () {
        if (isVisible && calculatedHidingEdge === 'top') {
            return height;
        }
        return 0;
    }, [isVisible, calculatedHidingEdge, height]);
    var bottomPadding = (0, react_1.useMemo)(function () {
        if (isVisible && calculatedHidingEdge === 'bottom') {
            return height;
        }
        return 0;
    }, [isVisible, calculatedHidingEdge, height]);
    var leftPadding = (0, react_1.useMemo)(function () {
        if (isVisible && calculatedHidingEdge === 'left') {
            return width;
        }
        return 0;
    }, [isVisible, calculatedHidingEdge, width]);
    var rightPadding = (0, react_1.useMemo)(function () {
        if (isVisible && calculatedHidingEdge === 'right') {
            return width;
        }
        return 0;
    }, [isVisible, calculatedHidingEdge, width]);
    var finalPadding = (0, react_1.useMemo)(function () {
        var _a, _b, _c, _d;
        return autoPadding
            ? {
                top: topPadding,
                right: rightPadding,
                bottom: bottomPadding,
                left: leftPadding
            }
            : {
                top: (_a = padding === null || padding === void 0 ? void 0 : padding.top) !== null && _a !== void 0 ? _a : 0,
                right: (_b = padding === null || padding === void 0 ? void 0 : padding.right) !== null && _b !== void 0 ? _b : 0,
                bottom: (_c = padding === null || padding === void 0 ? void 0 : padding.bottom) !== null && _c !== void 0 ? _c : 0,
                left: (_d = padding === null || padding === void 0 ? void 0 : padding.left) !== null && _d !== void 0 ? _d : 0
            };
    }, [
        autoPadding,
        topPadding,
        rightPadding,
        bottomPadding,
        leftPadding,
        padding === null || padding === void 0 ? void 0 : padding.top,
        padding === null || padding === void 0 ? void 0 : padding.right,
        padding === null || padding === void 0 ? void 0 : padding.bottom,
        padding === null || padding === void 0 ? void 0 : padding.left,
    ]);
    var slotState = (0, react_1.useMemo)(function () {
        return {
            id: id,
            isVisible: debouncedVisible,
            padding: {
                top: finalPadding.top,
                right: finalPadding.right,
                bottom: finalPadding.bottom,
                left: finalPadding.left
            },
            avoidMapboxControls: avoidMapboxControls
        };
    }, [
        id,
        debouncedVisible,
        finalPadding.top,
        finalPadding.right,
        finalPadding.bottom,
        finalPadding.left,
        avoidMapboxControls,
    ]);
    var _l = (0, react_1.useContext)(Map_1.mapContext).methods, unmountSlot = _l.unmountSlot, mountOrUpdateSlot = _l.mountOrUpdateSlot;
    (0, react_1.useEffect)(function () {
        mountOrUpdateSlot(slotState);
        return function () {
            unmountSlot(slotState);
        };
    }, [mountOrUpdateSlot, slotState, unmountSlot]);
    var x = (0, react_1.useMemo)(function () {
        if (!debouncedVisible || isLoading) {
            if (calculatedHidingEdge === 'left')
                return '-100%';
            if (calculatedHidingEdge === 'right')
                return '100%';
            return 0;
        }
        return 0;
    }, [debouncedVisible, calculatedHidingEdge, isLoading]);
    var y = (0, react_1.useMemo)(function () {
        if (!debouncedVisible || isLoading) {
            if (calculatedHidingEdge === 'top')
                return '-100%';
            if (calculatedHidingEdge === 'bottom')
                return '100%';
            return 0;
        }
        return 0;
    }, [debouncedVisible, calculatedHidingEdge, isLoading]);
    // Update children after animation complete
    var onAnimationComplete = (0, react_1.useCallback)(function () {
        setPersistedChildren(children);
    }, [children]);
    // Update children whenever Slot is visible
    (0, react_1.useEffect)(function () {
        if (isVisible === true) {
            setPersistedChildren(children);
        }
    }, [isVisible, children]);
    return (<framer_motion_1.motion.div ref={ref} animate={{
            x: x,
            y: y
        }} transition={{ ease: 'easeInOut', duration: isLoading ? 0 : 0.5 }} onAnimationComplete={onAnimationComplete} className={(0, classnames_1["default"])('fixed z-20', {
            'top-0': position === null || position === void 0 ? void 0 : position.includes('top'),
            'bottom-0': position === null || position === void 0 ? void 0 : position.includes('bottom'),
            'left-0': position === null || position === void 0 ? void 0 : position.includes('left'),
            'right-0': position === null || position === void 0 ? void 0 : position.includes('right')
        }, className)}>
      {persistChildrenWhenClosing ? persistedChildren : children}
    </framer_motion_1.motion.div>);
};
exports.Slot = Slot;
