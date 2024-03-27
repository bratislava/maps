"use strict";
exports.__esModule = true;
exports.JsonViewer = void 0;
var react_json_pretty_1 = require("react-json-pretty");
var JsonViewer = function (_a) {
    var json = _a.json;
    return (<div>
      <react_json_pretty_1["default"] data={json} style={{
            width: "100%",
            overflow: "hidden",
            fontWeight: "bold",
            borderRadius: "8px"
        }} theme={{
            main: "line-height:1.3;color:#6ce1fc;background:#333333;overflow:auto;padding:1rem;",
            error: "line-height:1.3;color:#6ce1fc;background:#333333;overflow:auto;",
            key: "color:#478dff;",
            string: "color:#c3e88d;",
            value: "color:#ff7747;",
            boolean: "color:#ff7747;"
        }}/>
    </div>);
};
exports.JsonViewer = JsonViewer;
