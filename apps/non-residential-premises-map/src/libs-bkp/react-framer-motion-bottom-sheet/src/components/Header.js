"use strict";
exports.__esModule = true;
exports.Header = void 0;
var react_1 = require("react");
var Sheet_1 = require("./Sheet");
var Header = function (_a) {
    var ChildrenNodeOrComponent = _a.children;
    var ctx = (0, react_1.useContext)(Sheet_1.sheetContext);
    var resultChildren = (0, react_1.useMemo)(function () {
        return typeof ChildrenNodeOrComponent === 'function' ? (<ChildrenNodeOrComponent {...ctx}/>) : (ChildrenNodeOrComponent);
    }, [ChildrenNodeOrComponent, ctx]);
    return <div>{resultChildren}</div>;
};
exports.Header = Header;
