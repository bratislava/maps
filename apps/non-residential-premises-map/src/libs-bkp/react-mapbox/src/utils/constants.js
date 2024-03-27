"use strict";
exports.__esModule = true;
exports.defaultSatelliteSource = exports.defaultInitialViewport = void 0;
// Default initial viewport if nothing is provided
exports.defaultInitialViewport = {
    center: {
        lat: 48.148598,
        lng: 17.107748
    },
    zoom: 12,
    pitch: 0,
    bearing: 0,
    padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
};
exports.defaultSatelliteSource = {
    type: 'raster',
    tileSize: 256,
    tiles: [
        'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/Hosted/Ortofoto_2021_WGS/MapServer/tile/{z}/{y}/{x}',
    ]
};
