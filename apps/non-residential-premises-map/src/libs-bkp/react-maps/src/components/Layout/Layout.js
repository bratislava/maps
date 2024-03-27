"use strict";
exports.__esModule = true;
exports.Layout = void 0;
var react_1 = require("react");
var Map_1 = require("../Map/Map");
function Layout(_a) {
    var _b = _a.isOnlyMobile, isOnlyMobile = _b === void 0 ? false : _b, _c = _a.isOnlyDesktop, isOnlyDesktop = _c === void 0 ? false : _c, children = _a.children;
    var isMobile = (0, react_1.useContext)(Map_1.mapContext).isMobile;
    var _d = (0, react_1.useState)(false), isVisible = _d[0], setVisible = _d[1];
    (0, react_1.useEffect)(function () {
        if (isMobile === null) {
            setVisible(false);
            return;
        }
        if (isOnlyMobile) {
            setVisible(isMobile);
        }
        else if (isOnlyDesktop) {
            setVisible(!isMobile);
        }
        else {
            setVisible(true);
        }
    }, [isOnlyMobile, isOnlyDesktop, setVisible, isMobile]);
    return <>{isVisible && children}</>;
}
exports.Layout = Layout;
