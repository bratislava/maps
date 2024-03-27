"use strict";
// Inspired by https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
// Secures typesafe access to environmental variables.
// In browser process.env is an empty object, the values are replaced during the build time, so they need to be accessed
// via process.env.NEXT_PUBLIC_...
exports.__esModule = true;
exports.environment = void 0;
/* eslint-disable no-process-env */
function assertEnv(variable, value) {
    if (!value) {
        throw new Error("Missing environment variable: ".concat(variable));
    }
    return value;
}
exports.environment = {
    nodeEnv: assertEnv("NODE_ENV", process.env.NODE_ENV),
    mapboxPublicToken: assertEnv("PUBLIC_MAPBOX_PUBLIC_TOKEN", process.env.PUBLIC_MAPBOX_PUBLIC_TOKEN),
    mapboxLightStyle: assertEnv("PUBLIC_MAPBOX_LIGHT_STYLE", process.env.PUBLIC_MAPBOX_LIGHT_STYLE),
    mapboxDarkStyle: assertEnv("PUBLIC_MAPBOX_DARK_STYLE", process.env.PUBLIC_MAPBOX_DARK_STYLE),
    mapboxLayerPrefix: assertEnv("PUBLIC_MAPBOX_LAYER_PREFIX", process.env.PUBLIC_MAPBOX_LAYER_PREFIX)
};
