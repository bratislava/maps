"use strict";
exports.__esModule = true;
exports.requestFullscreen = exports.exitFullscreen = exports.getFullscreenElement = void 0;
var DOCUMENT = document;
var getFullscreenElement = function () {
    var _a, _b, _c;
    var element = (_c = (_b = (_a = DOCUMENT.fullscreenElement) !== null && _a !== void 0 ? _a : DOCUMENT.webkitFullscreenElement) !== null && _b !== void 0 ? _b : DOCUMENT.mozFullScreenElement) !== null && _c !== void 0 ? _c : DOCUMENT.msFullscreenElement;
    if (element) {
        return element;
    }
    return null;
};
exports.getFullscreenElement = getFullscreenElement;
var exitFullscreen = function () {
    if (DOCUMENT.exitFullscreen) {
        DOCUMENT.exitFullscreen();
    }
    else if (DOCUMENT.webkitExitFullscreen) {
        DOCUMENT.webkitExitFullscreen();
    }
    else if (DOCUMENT.mozCancelFullScreen) {
        DOCUMENT.mozCancelFullScreen();
    }
    else if (DOCUMENT.msExitFullscreen) {
        DOCUMENT.msExitFullscreen();
    }
};
exports.exitFullscreen = exitFullscreen;
var requestFullscreen = function (inputElement) {
    var element = inputElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    }
    else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
    else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};
exports.requestFullscreen = requestFullscreen;
