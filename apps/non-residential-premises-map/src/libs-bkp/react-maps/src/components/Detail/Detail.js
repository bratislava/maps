"use strict";
exports.__esModule = true;
exports.Detail = void 0;
var react_1 = require("react");
var classnames_1 = require("classnames");
var Slot_1 = require("../Layout/Slot");
var usehooks_ts_1 = require("usehooks-ts");
var react_resize_detector_1 = require("react-resize-detector");
var react_maps_ui_1 = require("@bratislava/react-maps-ui");
var react_maps_icons_1 = require("@bratislava/react-maps-icons");
exports.Detail = (0, react_1.forwardRef)(function (_a, forwardedRef) {
    var children = _a.children, _b = _a.isBottomSheet, isBottomSheet = _b === void 0 ? false : _b, bottomSheetSnapPoints = _a.bottomSheetSnapPoints, _c = _a.bottomSheetInitialSnap, bottomSheetInitialSnap = _c === void 0 ? 1 : _c, onClose = _a.onClose, _d = _a.isVisible, isVisible = _d === void 0 ? true : _d, onBottomSheetSnapChange = _a.onBottomSheetSnapChange, _e = _a.hideBottomSheetHeader, hideBottomSheetHeader = _e === void 0 ? false : _e, _f = _a.avoidMapboxControls, avoidMapboxControls = _f === void 0 ? false : _f;
    var detailRef = (0, react_1.useRef)(null);
    var _g = (0, react_resize_detector_1.useResizeDetector)({
        targetRef: detailRef
    }).height, detailHeight = _g === void 0 ? 0 : _g;
    var _h = (0, react_1.useState)(0), currentSnap = _h[0], setCurrentSnap = _h[1];
    var _j = (0, react_1.useState)(0), currentSnapHeight = _j[0], setCurrentSnapHeight = _j[1];
    (0, react_1.useEffect)(function () {
        onBottomSheetSnapChange && onBottomSheetSnapChange(currentSnap);
    }, [currentSnap, onBottomSheetSnapChange]);
    var windowHeight = (0, usehooks_ts_1.useWindowSize)().height;
    var shouldBeBottomLeftCornerRounded = (0, react_1.useMemo)(function () {
        return windowHeight > detailHeight;
    }, [detailHeight, windowHeight]);
    return isBottomSheet ? (<Slot_1.Slot id="bottom-sheet-detail" position="bottom" padding={{ bottom: currentSnapHeight }}>
        <react_maps_ui_1.BottomSheet ref={forwardedRef} snapPoints={bottomSheetSnapPoints} defaultSnapPoint={bottomSheetInitialSnap} isOpen={isVisible} onSnapChange={function (_a) {
            var snapHeight = _a.snapHeight, snapIndex = _a.snapIndex;
            setCurrentSnapHeight(snapHeight);
            setCurrentSnap(snapIndex);
        }} 
    // switching between two features (terrain service) on homeles-people-help-map, causes multiple calls to onClose
    // onClose={onClose}
    hideHeader={hideBottomSheetHeader}>
          <div className="text-foreground-lightmode dark:text-foreground-darkmode">
            {children}
          </div>
        </react_maps_ui_1.BottomSheet>
      </Slot_1.Slot>) : (<Slot_1.Slot id="dektop-detail" position="top-right" isVisible={isVisible} autoPadding persistChildrenWhenClosing avoidMapboxControls={avoidMapboxControls}>
        <div ref={detailRef} className={(0, classnames_1["default"])('relative w-96 bg-background-lightmode dark:bg-background-darkmode max-h-full', {
            'shadow-lg': isVisible,
            'rounded-bl-lg': shouldBeBottomLeftCornerRounded
        })}>
          <div className={(0, classnames_1["default"])('dark:border-gray-darkmode/20 absolute h-full w-full border-l-2 border-b-2 border-[transparent]', { 'rounded-bl-lg': shouldBeBottomLeftCornerRounded })}/>
          <react_maps_ui_1.IconButton className={(0, classnames_1["default"])('hidden w-8 h-8 !rounded-full !border-0 !shadow-none absolute right-4 top-4 md:flex items-center justify-center z-50')} onClick={onClose}>
            <react_maps_icons_1.X size="sm"/>
          </react_maps_ui_1.IconButton>
          <react_maps_ui_1.ScrollArea>{children}</react_maps_ui_1.ScrollArea>
        </div>
      </Slot_1.Slot>);
});
exports.Detail.displayName = 'Detail';
