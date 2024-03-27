"use strict";
exports.__esModule = true;
exports.getClosestSnapPoint = void 0;
var getClosestSnapPoint = function (snapPoints, y) {
    var closestSnapPointHeight = snapPoints.reduce(function (prev, current) {
        return Math.abs(current - y) < Math.abs(prev - y) ? current : prev;
    });
    var closestSnapPointIndex = snapPoints.findIndex(function (foundSnapPoint) { return foundSnapPoint === closestSnapPointHeight; });
    return { height: closestSnapPointHeight, index: closestSnapPointIndex };
};
exports.getClosestSnapPoint = getClosestSnapPoint;
