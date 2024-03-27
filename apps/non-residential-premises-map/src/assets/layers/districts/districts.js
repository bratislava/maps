"use strict";
exports.__esModule = true;
var colors_1 = require("../../../utils/colors");
var styles = [
    {
        id: "districts-line",
        type: "line",
        paint: {
            "line-color": colors_1.colors.disctrictBorder,
            "line-opacity": 0.4,
            "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                // zoom is 11 (or less) -> circle radius will be 1px
                11,
                2,
                // zoom is 20 (or greater) -> circle radius will be 3px
                20,
                5,
            ]
        }
    },
];
exports["default"] = styles;
