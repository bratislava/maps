"use strict";
exports.__esModule = true;
exports.Modal = void 0;
var react_maps_icons_1 = require("@bratislava/react-maps-icons");
var react_1 = require("@headlessui/react");
var classnames_1 = require("classnames");
var react_2 = require("react");
var IconButton_1 = require("./IconButton");
var Modal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, title = _a.title, description = _a.description, children = _a.children, closeButtonIcon = _a.closeButtonIcon, _b = _a.closeButtonOut, closeButtonOut = _b === void 0 ? false : _b, _c = _a.closeButtonInCorner, closeButtonInCorner = _c === void 0 ? false : _c, _d = _a.noOverlayStyles, noOverlayStyles = _d === void 0 ? false : _d, underlayClassName = _a.underlayClassName, overlayClassName = _a.overlayClassName, _e = _a.hideCloseButtonIcon, hideCloseButtonIcon = _e === void 0 ? false : _e;
    return (<react_1.Transition show={isOpen} as={react_2.Fragment}>
      <react_1.Dialog className="fixed z-50 top-0 left-0 right-0 bottom-0 text-foreground-lightmode dark:text-foreground-darkmode" onClose={function () { return onClose && onClose(); }}>
        <react_1.Transition.Child as={react_2.Fragment} enter="duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed bg-gray-lightmode dark:bg-black bg-opacity-40 dark:bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50"/>
        </react_1.Transition.Child>

        <react_1.Transition.Child as={react_2.Fragment} enter="ease-out duration-200 transform" enterFrom="opacity-0 -translate-y-12" enterTo="opacity-100 translate-y-0" leave="ease-in duration-200 transform" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
          <div className={(0, classnames_1["default"])("fixed top-0 left-0 right-0 bottom-0 items-center z-50", underlayClassName)}>
            <div className="w-full h-full overflow-auto">
              <div className="flex items-center">
                <div className="w-full min-h-screen flex items-center justify-center p-8">
                  <react_1.Dialog.Panel className={(0, classnames_1["default"])(closeButtonOut ? "" : "relative", {
            "bg-background-lightmode dark:bg-background-darkmode rounded-xl flex flex-col p-8 gap-4": !noOverlayStyles
        }, overlayClassName)}>
                    {title && (<react_1.Dialog.Title className="text-md font-semibold">
                        {title}
                      </react_1.Dialog.Title>)}

                    {description && (<react_1.Dialog.Description className="">
                        {description}
                      </react_1.Dialog.Description>)}

                    {children}

                    {!noOverlayStyles && (<div className={(0, classnames_1["default"])("w-full flex absolute", {
                "-top-6 -right-6 justify-end": closeButtonInCorner,
                "left-0 -bottom-6 justify-center": !closeButtonInCorner
            })}>
                        {!hideCloseButtonIcon && (<IconButton_1["default"] className="w-12 outline-none h-12 !bg-primary !border-primary !rounded-full flex items-center justify-center" onClick={function () { return onClose && onClose(); }}>
                            {closeButtonIcon !== null && closeButtonIcon !== void 0 ? closeButtonIcon : <react_maps_icons_1.X />}
                          </IconButton_1["default"]>)}
                      </div>)}
                  </react_1.Dialog.Panel>
                </div>
              </div>
            </div>
          </div>
        </react_1.Transition.Child>
      </react_1.Dialog>
    </react_1.Transition>);
};
exports.Modal = Modal;
