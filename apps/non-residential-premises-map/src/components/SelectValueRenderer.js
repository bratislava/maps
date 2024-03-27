"use strict";
exports.__esModule = true;
exports.SelectValueRenderer = void 0;
var React = require("react");
var SelectValueRenderer = function (_a) {
    var values = _a.values, placeholder = _a.placeholder, multiplePlaceholder = _a.multiplePlaceholder, singlePlaceholder = _a.singlePlaceholder;
    return (<div className="text-left px-3 truncate whitespace-nowrap">
      {values.length === 0
            ? placeholder
            : values.length === 1
                ? singlePlaceholder !== null && singlePlaceholder !== void 0 ? singlePlaceholder : values[0]
                : multiplePlaceholder}
    </div>);
};
exports.SelectValueRenderer = SelectValueRenderer;
