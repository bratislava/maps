"use strict";
exports.__esModule = true;
exports.AccordionItem = void 0;
var react_maps_icons_1 = require("@bratislava/react-maps-icons");
var react_accordion_1 = require("@radix-ui/react-accordion");
var react_1 = require("@stitches/react");
var classnames_1 = require("classnames");
var AccordionChevron = (0, react_1.styled)(react_maps_icons_1.Chevron, {
    "[data-state=closed] &": { transform: "rotate(180deg)" }
});
var openKeyframes = (0, react_1.keyframes)({
    from: { height: 0 },
    to: { height: "var(--radix-accordion-content-height)" }
});
var closeKeyframes = (0, react_1.keyframes)({
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: 0 }
});
var AccordionContent = (0, react_1.styled)(react_accordion_1.Content, {
    '&[data-state="open"]': {
        animation: "".concat(openKeyframes, " 300ms ease-out forwards")
    },
    '&[data-state="closed"]': {
        animation: "".concat(closeKeyframes, " 300ms ease-out forwards")
    }
});
var AccordionItem = function (_a) {
    var children = _a.children, value = _a.value, title = _a.title, rightSlot = _a.rightSlot, className = _a.className, _b = _a.isActive, isActive = _b === void 0 ? false : _b, _c = _a.isOpenable, isOpenable = _c === void 0 ? true : _c, _d = _a.paasDesign, paasDesign = _d === void 0 ? false : _d, _e = _a.headerIsTrigger, headerIsTrigger = _e === void 0 ? false : _e, headerClassName = _a.headerClassName, style = _a.style;
    return (<react_accordion_1.Item value={value} className={(0, classnames_1["default"])("text-left w-full justify-between items-center", className)} style={style}>
      <react_accordion_1.Header className="flex flex-col">
        {headerIsTrigger ? (<react_accordion_1.Trigger className={(0, classnames_1["default"])("flex w-full gap-4 items-center justify-between", {
                "": paasDesign
            }, headerClassName)}>
            <div>{title}</div>
            <div className={(0, classnames_1["default"])("flex gap-4 items-center", {
                "bg-primary-soft text-foreground-lightmode": paasDesign && isActive
            })}>
              {rightSlot}
              {isOpenable && (<div className="p-1">
                  <AccordionChevron className="transition mr-[2px]" size="xs"/>
                </div>)}
            </div>
          </react_accordion_1.Trigger>) : (<div className={(0, classnames_1["default"])("flex w-full gap-4 items-center justify-between", {
                "": paasDesign
            }, headerClassName)}>
            <div>{title}</div>
            <div className={(0, classnames_1["default"])("flex gap-4 h-12 px-6 items-center", {
                "bg-primary-soft text-foreground-lightmode": paasDesign && isActive
            })}>
              {rightSlot}
              {isOpenable && (<react_accordion_1.Trigger className="p-1">
                  <AccordionChevron className="transition mr-[2px]" size="xs"/>
                </react_accordion_1.Trigger>)}
            </div>
          </div>)}
      </react_accordion_1.Header>
      <AccordionContent className="overflow-hidden">
        <div>{children}</div>
      </AccordionContent>
    </react_accordion_1.Item>);
};
exports.AccordionItem = AccordionItem;
