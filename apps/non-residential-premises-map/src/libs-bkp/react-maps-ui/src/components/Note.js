"use strict";
exports.__esModule = true;
exports.Note = void 0;
var classnames_1 = require("classnames");
var Note = function (_a) {
    var children = _a.children, className = _a.className;
    return (<div className={(0, classnames_1["default"])("p-6 rounded-xl bg-primary/20 dark:bg-primary/20 font-light text-[16px]", className)}>
      {children}
    </div>);
};
exports.Note = Note;
