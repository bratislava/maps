"use strict";
exports.__esModule = true;
exports.SelectOption = void 0;
var react_1 = require("@headlessui/react");
var classnames_1 = require("classnames");
var SelectOption = function (_a) {
    var value = _a.value, children = _a.children;
    return (<react_1.Listbox.Option key={value} value={value}>
      {function (_a) {
            var active = _a.active, selected = _a.selected;
            return (<div className={(0, classnames_1["default"])("px-4 py-1 relative outline-none select-none cursor-pointer", {
                    "bg-gray-lightmode dark:bg-gray-darkmode bg-opacity-10 dark:bg-opacity-20": active && !selected,
                    "bg-primary-soft dark:text-background-darkmode": selected
                })}>
          {children !== null && children !== void 0 ? children : value}
        </div>);
        }}
    </react_1.Listbox.Option>);
};
exports.SelectOption = SelectOption;
