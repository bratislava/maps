import { colors } from "../utils/colors";

const styles = [
    {
        id: "udr-line2",
        type: "line",
        paint: {
            "line-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                colors.orange,
                colors.green2,
            ],
            "line-dasharray": [
                "match",
                ["get", "web"],
                "planned",
                ["literal", [2, 2]],
                ["literal", [1, 0]],
            ],
            "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                // zoom is 11 (or less) -> circle radius will be 1px
                11,
                1,
                // zoom is 20 (or greater) -> circle radius will be 3px
                20,
                3,
            ],
        },
    },
    {
        id: "udr-fill2",
        type: "fill",
        paint: {
            "fill-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                colors.orange,
                colors.green2,
            ],
            "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.4, 0.2],
        },
    },
];

export default styles;
