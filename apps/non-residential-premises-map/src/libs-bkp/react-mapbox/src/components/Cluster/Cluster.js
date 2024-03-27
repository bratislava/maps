"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Cluster = void 0;
var react_1 = require("react");
var lodash_groupby_1 = require("lodash.groupby");
var lodash_clonedeep_1 = require("lodash.clonedeep");
var supercluster_1 = require("supercluster");
var Filter_1 = require("../Filter/Filter");
var Mapbox_1 = require("../Mapbox/Mapbox");
var Cluster = function (_a) {
    var children = _a.children, features = _a.features, _b = _a.radius, radius = _b === void 0 ? 100 : _b, _c = _a.splitPoints, splitPoints = _c === void 0 ? false : _c;
    var isFeatureVisible = (0, react_1.useContext)(Filter_1.filterContext).isFeatureVisible;
    var pointFeatures = (0, react_1.useMemo)(function () {
        return features.filter(function (f) { return f.geometry.type === 'Point'; });
    }, [features]);
    var adjustCoordinates = function (featuresToFilter) {
        // group features with same coordinates
        var groupedFeatures = (0, lodash_groupby_1["default"])(featuresToFilter, function (f) {
            // pragmatic identity, should not be problematic on the 'numbers' used in point coordinates
            return f.geometry.coordinates.join(',');
        });
        console.log('original: ', featuresToFilter);
        console.log('grouped: ', groupedFeatures);
        // split the features with same coordinates into a line side-by-side
        return Object.values(groupedFeatures).reduce(function (acc, curr) {
            return __spreadArray(__spreadArray([], acc, true), curr.map(function (feature, index) {
                var updatedFeature = (0, lodash_clonedeep_1["default"])(feature);
                updatedFeature.geometry.coordinates[0] =
                    updatedFeature.geometry.coordinates[0] + index * 0.0001;
                return updatedFeature;
            }), true);
        }, []);
    };
    // This filter is workeround to prevent unselectable multiple features with exact coordinates
    var pointFeaturesUpdated = (0, react_1.useMemo)(function () { return (splitPoints ? adjustCoordinates(pointFeatures) : pointFeatures); }, [pointFeatures, splitPoints]);
    var map = (0, react_1.useContext)(Mapbox_1.mapboxContext).map;
    var _d = (0, react_1.useState)([]), clusters = _d[0], setClusters = _d[1];
    (0, react_1.useEffect)(function () {
        var recalculate = function () {
            if (!map)
                return;
            var zoom = map.getZoom();
            // Dynamic bbox
            // const bounds: mapboxgl.LngLatBounds = map.getBounds();
            // const bbox: [number, number, number, number] = [
            //   bounds.getWest(),
            //   bounds.getSouth(),
            //   bounds.getEast(),
            //   bounds.getNorth(),
            // ];
            // Static bbox
            var bbox = [
                16.847534, 47.734705, 18.400726, 48.841221,
            ];
            var supercluster = new supercluster_1["default"]({ radius: radius, maxZoom: 30 });
            supercluster.load(pointFeaturesUpdated.filter(function (f) {
                return isFeatureVisible === undefined ? true : isFeatureVisible(f);
            }));
            var newClusters = supercluster
                .getClusters(bbox, zoom !== null && zoom !== void 0 ? zoom : 0)
                .map(function (cluster, key) {
                var _a, _b;
                var isCluster = cluster.properties.cluster_id !== undefined;
                if (isCluster) {
                    var features_1 = supercluster.getLeaves(cluster.properties.cluster_id, Infinity);
                    return {
                        key: (_a = features_1[0].id) !== null && _a !== void 0 ? _a : key,
                        features: features_1,
                        lng: cluster.geometry.coordinates[0],
                        lat: cluster.geometry.coordinates[1],
                        isCluster: isCluster,
                        clusterExpansionZoom: supercluster.getClusterExpansionZoom(cluster.properties.cluster_id)
                    };
                }
                else {
                    return {
                        key: (_b = cluster.id) !== null && _b !== void 0 ? _b : key,
                        features: [cluster],
                        lng: cluster.geometry.coordinates[0],
                        lat: cluster.geometry.coordinates[1],
                        isCluster: isCluster,
                        clusterExpansionZoom: null
                    };
                }
            });
            setClusters(newClusters);
        };
        // Do not remove this recalculation block, it recalculates features by Map moving and filtering and scrolling
        recalculate();
        var timer = setTimeout(recalculate, 10);
        map === null || map === void 0 ? void 0 : map.on('move', recalculate);
        return function () {
            map === null || map === void 0 ? void 0 : map.off('move', recalculate);
            clearTimeout(timer);
        };
    }, [map, isFeatureVisible, radius, pointFeaturesUpdated]);
    return <>{clusters.map(function (cluster) { return children(cluster); })}</>;
};
exports.Cluster = Cluster;
