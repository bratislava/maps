"use strict";
exports.__esModule = true;
exports.Popover = void 0;
var react_1 = require("@floating-ui/react");
var classnames_1 = require("classnames");
var react_2 = require("react");
var PopoverArrow_1 = require("./PopoverArrow");
var Popover = function (_a) {
    var _b, _c, _d, _e;
    var Button = _a.button, panel = _a.panel, _f = _a.isSmall, isSmall = _f === void 0 ? false : _f, allowedPlacements = _a.allowedPlacements, isOpenExternal = _a.isOpen, onOpenChange = _a.onOpenChange, className = _a.className;
    var arrowRef = (0, react_2.useRef)(null);
    var _g = (0, react_2.useState)(false), isOpenInternal = _g[0], setOpenInternal = _g[1];
    var isOpen = (0, react_2.useMemo)(function () {
        return isOpenExternal !== null && isOpenExternal !== void 0 ? isOpenExternal : isOpenInternal;
    }, [isOpenExternal, isOpenInternal]);
    var setOpen = (0, react_2.useMemo)(function () {
        return onOpenChange !== null && onOpenChange !== void 0 ? onOpenChange : setOpenInternal;
    }, [onOpenChange]);
    var _h = (0, react_1.useFloating)({
        open: isOpen,
        onOpenChange: setOpen,
        strategy: "fixed",
        middleware: [
            (0, react_1.offset)(15),
            (0, react_1.shift)(),
            (0, react_1.autoPlacement)({ allowedPlacements: allowedPlacements }),
            (0, react_1.arrow)({ element: arrowRef }),
        ]
    }), x = _h.x, y = _h.y, reference = _h.reference, floating = _h.floating, strategy = _h.strategy, placement = _h.placement, middlewareData = _h.middlewareData, context = _h.context;
    var _j = (0, react_1.useInteractions)([
        (0, react_1.useDismiss)(context, {
            escapeKey: true,
            outsidePressEvent: "mousedown",
            ancestorScroll: true
        }),
    ]), getReferenceProps = _j.getReferenceProps, getFloatingProps = _j.getFloatingProps;
    return (<>
      <div className={(0, classnames_1["default"])("inline-block w-fit", className)} ref={reference} {...getReferenceProps()}>
        {typeof Button === "function" ? (<Button isOpen={isOpen} open={function () { return setOpen(true); }} close={function () { return setOpen(false); }} toggle={function () { return setOpen(!isOpen); }}/>) : (Button)}
      </div>
      <react_1.FloatingPortal>
        {isOpen && (<div {...getFloatingProps()} className="z-40" ref={floating} style={{
                position: strategy,
                top: "".concat(y !== null && y !== void 0 ? y : 0, "px"),
                left: "".concat(x !== null && x !== void 0 ? x : 0, "px")
            }}>
            <div className="relative">
              <PopoverArrow_1.PopoverArrow ref={arrowRef} placement={placement} x={((_b = middlewareData.arrow) === null || _b === void 0 ? void 0 : _b.x) ? "".concat((_c = middlewareData.arrow) === null || _c === void 0 ? void 0 : _c.x, "px") : ""} y={((_d = middlewareData.arrow) === null || _d === void 0 ? void 0 : _d.y) ? "".concat((_e = middlewareData.arrow) === null || _e === void 0 ? void 0 : _e.y, "px") : ""} isSmall={isSmall}/>
              <div className={(0, classnames_1["default"])("bg-background-lightmode w-fit dark:bg-background-darkmode border-2 border-background-lightmode dark:border-gray-darkmode/20 rounded-lg shadow-lg text-foreground-lightmode dark:text-foreground-darkmode", {
                "p-6": !isSmall,
                "p-2": isSmall
            })}>
                {panel}
              </div>
            </div>
          </div>)}
      </react_1.FloatingPortal>
    </>);
};
exports.Popover = Popover;
