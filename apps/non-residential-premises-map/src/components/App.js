"use strict";
exports.__esModule = true;
exports.App = void 0;
var react_use_arcgis_1 = require("../libs/react-use-arcgis");
var cx = require("classnames");
var React = require("react");
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
require("../styles.css");
var colors_1 = require("../utils/colors");
var geojson_data_1 = require("../libs/geojson-data");
// maps
var react_maps_1 = require("../libs/react-maps");
var react_mapbox_1 = require("../libs/react-mapbox");
// layer styles
var districts_1 = require("../assets/layers/districts/districts");
// utils
var utils_1 = require("../libs/utils");
var utils_2 = require("../utils/utils");
var Filters_1 = require("./Filters");
var react_maps_icons_1 = require("../libs/react-maps-icons");
var react_maps_ui_1 = require("../libs/react-maps-ui");
var react_resize_detector_1 = require("react-resize-detector");
var usehooks_ts_1 = require("usehooks-ts");
var Detail_1 = require("./Detail");
var Legend_1 = require("./Legend");
var Marker_1 = require("./Marker");
var const_1 = require("../utils/const");
var environment_1 = require("../../environment");
var isDevelopment = !!environment_1.environment.nodeEnv;
var App = function () {
    var _a;
    var _b = (0, react_i18next_1.useTranslation)(), t = _b.t, i18n = _b.i18n;
    var rawData = (0, react_use_arcgis_1.useArcgis)(const_1.GEOPORTAL_LAYER_URL, {
        format: "geojson"
    }).data;
    var _c = (0, react_1.useState)(null), data = _c[0], setData = _c[1];
    var _d = (0, react_1.useState)([]), uniqueDistricts = _d[0], setUniqueDistricts = _d[1];
    var _e = (0, react_1.useState)([]), setUniqueStreets = _e[1];
    var _f = (0, react_1.useState)([]), uniquePurposes = _f[0], setUniquePurposes = _f[1];
    var _g = (0, react_1.useState)([]), uniqueOccupancies = _g[0], setUniqueOccupancies = _g[1];
    var _h = (0, react_1.useState)(false), isLegendVisible = _h[0], setLegendVisible = _h[1];
    (0, react_1.useEffect)(function () {
        document.title = t("tabTitle");
    }, [t]);
    (0, react_1.useEffect)(function () {
        if (rawData) {
            var _a = (0, utils_2.processData)(rawData), data_1 = _a.data, uniqueDistricts_1 = _a.uniqueDistricts, uniquePurposes_1 = _a.uniquePurposes, uniqueOccupancies_1 = _a.uniqueOccupancies, uniqueStreets = _a.uniqueStreets;
            setUniqueDistricts(uniqueDistricts_1);
            setUniqueStreets(uniqueStreets);
            setUniquePurposes(uniquePurposes_1);
            setUniqueOccupancies(uniqueOccupancies_1);
            setData(data_1);
        }
    }, [rawData]);
    var _j = (0, react_1.useState)(true), isSidebarVisible = _j[0], setSidebarVisible = _j[1];
    var mapRef = (0, react_1.useRef)(null);
    var _k = (0, react_1.useState)([]), selectedFeatures = _k[0], setSelectedFeatures = _k[1];
    var _l = (0, react_1.useState)(null), isMobile = _l[0], setMobile = _l[1];
    var _m = (0, react_1.useState)(null), zoom = _m[0], setZoom = _m[1];
    var previousSidebarVisible = (0, utils_1.usePrevious)(isSidebarVisible);
    var previousMobile = (0, utils_1.usePrevious)(isMobile);
    var _o = (0, react_1.useState)(false), frameState = _o[0], setFrameState = _o[1];
    var frameStateSideBar = (0, react_1.useRef)(isSidebarVisible);
    var handleSideBar = (0, react_1.useCallback)(function (value, changePrevious) {
        if (changePrevious)
            frameStateSideBar.current = value;
        setSidebarVisible(value);
    }, []);
    var districtFilter = (0, react_mapbox_1.useFilter)({
        property: "district",
        keys: uniqueDistricts
    });
    var purposeFilter = (0, react_mapbox_1.useFilter)({
        property: "purpose",
        keys: uniquePurposes
    });
    var occupancyFilter = (0, react_mapbox_1.useFilter)({
        property: "occupancy",
        keys: uniqueOccupancies
    });
    var combinedFilter = (0, react_mapbox_1.useCombinedFilter)({
        combiner: "all",
        filters: [
            {
                filter: districtFilter,
                mapToActive: function (activeDistricts) { return ({
                    title: t("filters.district.title"),
                    items: activeDistricts
                }); }
            },
            {
                filter: purposeFilter,
                mapToActive: function (activePurposes) { return ({
                    title: t("filters.purpose.title"),
                    items: activePurposes
                }); }
            },
            {
                filter: occupancyFilter,
                mapToActive: function (activeOccupancies) { return ({
                    title: t("filters.occupancy.title"),
                    items: activeOccupancies.map(function (ao) {
                        return t("filters.occupancy.types.".concat(ao));
                    })
                }); }
            },
        ]
    });
    (0, react_mapbox_1.useMarkerOrFeaturesInQuery)({
        markersData: data,
        selectedFeatures: selectedFeatures,
        zoomAtWhichMarkerWasSelected: zoom,
        setSelectedFeaturesAndZoom: function (features, requiredZoom) {
            // frameState is not set in the beginning - setTimeout as a lazy solution
            setTimeout(function () {
                var _a, _b, _c;
                setSelectedFeatures(features || []);
                var f = features === null || features === void 0 ? void 0 : features[0];
                if (f) {
                    (_a = mapRef.current) === null || _a === void 0 ? void 0 : _a.changeViewport({
                        zoom: Math.max(requiredZoom !== null && requiredZoom !== void 0 ? requiredZoom : 0, 14),
                        center: {
                            // TODO continue here
                            lng: (_b = f === null || f === void 0 ? void 0 : f.geometry) === null || _b === void 0 ? void 0 : _b.coordinates[0],
                            lat: (_c = f === null || f === void 0 ? void 0 : f.geometry) === null || _c === void 0 ? void 0 : _c.coordinates[1]
                        }
                    });
                }
            }, 300);
        }
    });
    (0, react_1.useEffect)(function () {
        if (!frameState)
            return;
        if (selectedFeatures.length > 0) {
            handleSideBar(false, false);
        }
        else {
            handleSideBar(frameStateSideBar.current, true);
        }
    }, [frameState, selectedFeatures, handleSideBar]);
    var minAreaDefault = 0;
    var _p = (0, react_1.useState)(minAreaDefault), minArea = _p[0], setMinArea = _p[1];
    var _q = (0, react_1.useState)(minAreaDefault), minAreaDebounced = _q[0], setMinAreaDebounced = _q[1];
    var maxAreaDefault = 15000;
    var _r = (0, react_1.useState)(maxAreaDefault), maxArea = _r[0], setMaxArea = _r[1];
    var _s = (0, react_1.useState)(maxAreaDefault), maxAreaDebounced = _s[0], setMaxAreaDebounced = _s[1];
    var minPriceDefault = 0;
    var _t = (0, react_1.useState)(minPriceDefault), minPrice = _t[0], setMinPrice = _t[1];
    var _u = (0, react_1.useState)(minPriceDefault), minPriceDebounced = _u[0], setMinPriceDebounced = _u[1];
    var maxPriceDefault = 100000;
    var _v = (0, react_1.useState)(maxPriceDefault), maxPrice = _v[0], setMaxPrice = _v[1];
    var _w = (0, react_1.useState)(maxPriceDefault), maxPriceDebounced = _w[0], setMaxPriceDebounced = _w[1];
    var fullFilterExpression = (0, react_1.useMemo)(function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var filter = [
            "all",
            [">=", "approximateArea", minAreaDebounced],
            ["<=", "approximateArea", maxAreaDebounced],
            [">=", "approximateRentPricePerYear", minPriceDebounced],
            ["<=", "approximateRentPricePerYear", maxPriceDebounced],
        ];
        if (purposeFilter.expression.length)
            filter.push(purposeFilter.expression);
        if (occupancyFilter.expression.length)
            filter.push(occupancyFilter.expression);
        if (districtFilter.expression.length)
            filter.push(districtFilter.expression);
        return filter;
    }, [
        minAreaDebounced,
        maxAreaDebounced,
        minPriceDebounced,
        maxPriceDebounced,
        districtFilter.expression,
        purposeFilter.expression,
        occupancyFilter.expression,
    ]);
    var closeDetail = (0, react_1.useCallback)(function () {
        setSelectedFeatures([]);
    }, []);
    // close detailbox when sidebar is opened on mobile
    (0, react_1.useEffect)(function () {
        if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
            closeDetail();
        }
    }, [closeDetail, isMobile, isSidebarVisible, previousMobile, previousSidebarVisible]);
    // close sidebar on mobile and open on desktop
    (0, react_1.useEffect)(function () {
        // from mobile to desktop
        if (previousMobile !== false && isMobile === false) {
            handleSideBar(true, true);
        }
        // from desktop to mobile
        if (previousMobile !== true && isMobile === true) {
            handleSideBar(false, true);
        }
        window === window.parent || isMobile ? setFrameState(false) : setFrameState(true);
    }, [isMobile, previousMobile, handleSideBar]);
    // fit to district
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = mapRef.current) === null || _a === void 0 ? void 0 : _a.fitDistrict(districtFilter.activeKeys);
    }, [districtFilter.activeKeys]);
    // move point to center when selected
    (0, react_1.useEffect)(function () {
        var MAP = mapRef.current;
        if (MAP && selectedFeatures.length) {
            var firstFeature_1 = selectedFeatures[0];
            setTimeout(function () {
                var _a;
                if (firstFeature_1.geometry.type === "Point") {
                    (_a = mapRef.current) === null || _a === void 0 ? void 0 : _a.changeViewport({
                        center: {
                            lng: firstFeature_1.geometry.coordinates[0],
                            lat: firstFeature_1.geometry.coordinates[1]
                        }
                    });
                }
            }, 0);
        }
    }, [selectedFeatures]);
    var areFiltersDefault = (0, react_1.useMemo)(function () {
        return (occupancyFilter.areDefault &&
            districtFilter.areDefault &&
            purposeFilter.areDefault &&
            minPriceDebounced === minPriceDefault &&
            maxPriceDebounced === maxPriceDefault &&
            minAreaDebounced === minAreaDefault &&
            maxAreaDebounced === maxAreaDefault);
    }, [
        maxAreaDebounced,
        maxPriceDebounced,
        minAreaDebounced,
        minPriceDebounced,
        districtFilter.areDefault,
        occupancyFilter.areDefault,
        purposeFilter.areDefault,
    ]);
    (0, react_1.useEffect)(function () {
        closeDetail();
    }, [
        closeDetail,
        maxAreaDebounced,
        maxPriceDebounced,
        minAreaDebounced,
        minPriceDebounced,
        districtFilter.keys,
        occupancyFilter.keys,
        purposeFilter.keys,
    ]);
    // Open legend on desktop by default
    (0, react_1.useEffect)(function () {
        var _a;
        if (!isMobile && previousMobile) {
            setTimeout(function () { return setLegendVisible(true); }, 2000);
        }
        if ((data === null || data === void 0 ? void 0 : data.features) && isMobile) {
            (_a = mapRef.current) === null || _a === void 0 ? void 0 : _a.fitFeature(data.features, { padding: 16 });
        }
    }, [data === null || data === void 0 ? void 0 : data.features, isMobile, previousMobile]);
    var handleResetFilters = (0, react_1.useCallback)(function () {
        setMinArea(minAreaDefault);
        setMaxArea(maxAreaDefault);
        setMinPrice(minPriceDefault);
        setMaxPrice(maxPriceDefault);
        setMinAreaDebounced(minAreaDefault);
        setMaxAreaDebounced(maxAreaDefault);
        setMinPriceDebounced(minPriceDefault);
        setMaxPriceDebounced(maxPriceDefault);
        occupancyFilter.reset();
        districtFilter.reset();
        purposeFilter.reset();
    }, [occupancyFilter, districtFilter, purposeFilter]);
    var isDetailOpen = (0, react_1.useMemo)(function () { return !!selectedFeatures.length; }, [selectedFeatures]);
    var legend = (0, react_1.useMemo)(function () {
        return (<Legend_1.Legend items={[
                {
                    title: t("legend.free"),
                    color: colors_1.colors.free
                },
                {
                    title: t("legend.forRent"),
                    color: colors_1.colors.forRent
                },
                {
                    title: t("legend.occupied"),
                    color: colors_1.colors.occupied
                },
                {
                    title: t("legend.other"),
                    color: colors_1.colors.other
                },
                {
                    title: t("legend.districtBorder"),
                    color: colors_1.colors.disctrictBorder,
                    type: "line"
                },
            ]}/>);
    }, [t]);
    var _x = (0, react_resize_detector_1.useResizeDetector)(), _y = _x.height, viewportControlsHeight = _y === void 0 ? 0 : _y, viewportControlsRef = _x.ref;
    var _z = (0, react_resize_detector_1.useResizeDetector)(), _0 = _z.height, detailHeight = _0 === void 0 ? 0 : _0, detailRef = _z.ref;
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = detailRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView();
    }, [detailRef, selectedFeatures]);
    var windowHeight = (0, usehooks_ts_1.useWindowSize)().height;
    var shouldBeViewportControlsMoved = (0, react_1.useMemo)(function () {
        return windowHeight < viewportControlsHeight + detailHeight + 40;
    }, [windowHeight, detailHeight, viewportControlsHeight]);
    return (<react_maps_1.Map loadingSpinnerColor={colors_1.colors.primary} ref={mapRef} minZoom={!isMobile ? 10.8 : 10.4} mapboxAccessToken={environment_1.environment.mapboxPublicToken} mapStyles={{
            light: environment_1.environment.mapboxLightStyle,
            dark: environment_1.environment.mapboxDarkStyle
        }} enableSatelliteOnLoad initialViewport={{
            zoom: 12.229005488986582,
            center: {
                lat: 48.148598,
                lng: 17.107748
            }
        }} isDevelopment={isDevelopment} onMobileChange={setMobile} onMapClick={closeDetail} onViewportChangeDebounced={function (viewport) {
            setZoom(viewport.zoom);
        }} mapInformation={{
            title: t("informationModal.title"),
            // description: (
            //   <Trans i18nKey="informationModal.description">
            //     before
            //     <a href={t("informationModal.descriptionLink")} className="underline font-semibold">
            //       link
            //     </a>
            //   </Trans>
            // ),
            description: "text",
            partners: [
                {
                    name: "bratislava",
                    link: "https://bratislava.sk",
                    image: "logos/bratislava.png"
                },
                {
                    name: "inovation",
                    link: "https://inovacie.bratislava.sk/",
                    image: "logos/inovation.png"
                },
                {
                    name: "geoportal",
                    link: "https://nest-proxy.bratislava.sk/geoportal/pfa/apps/sites/#/verejny-mapovy-portal",
                    image: "logos/geoportal.png"
                },
            ],
            footer: (<react_i18next_1.Trans i18nKey="informationModal.footer">
            before
            <a href={t("informationModal.footerLink")} className="underline font-semibold">
              link
            </a>
          </react_i18next_1.Trans>)
        }}>
      <react_mapbox_1.Filter expression={fullFilterExpression}>
        <react_mapbox_1.Cluster features={(_a = data === null || data === void 0 ? void 0 : data.features) !== null && _a !== void 0 ? _a : []} radius={28}>
          {function (_a) {
            var features = _a.features, lng = _a.lng, lat = _a.lat, isCluster = _a.isCluster, key = _a.key, clusterExpansionZoom = _a.clusterExpansionZoom;
            return (<Marker_1.Marker features={features} lng={lng} lat={lat} key={key} isSelected={!!selectedFeatures.find(function (sf) { return sf.id === features[0].id; })} onClick={function () {
                    var _a, _b;
                    // When it's cluster and it's expandable
                    if (isCluster && clusterExpansionZoom && clusterExpansionZoom !== 31) {
                        setSelectedFeatures([]);
                        (_a = mapRef.current) === null || _a === void 0 ? void 0 : _a.changeViewport({
                            center: { lat: lat, lng: lng },
                            zoom: clusterExpansionZoom
                        });
                    }
                    else {
                        setSelectedFeatures(features);
                        (_b = mapRef.current) === null || _b === void 0 ? void 0 : _b.changeViewport({ center: { lat: lat, lng: lng } });
                    }
                }}/>);
        }}
        </react_mapbox_1.Cluster>
      </react_mapbox_1.Filter>

      {/* <Filter expression={areaFilterExpression}>
          {(data?.features as Feature<Point>[])?.map((feature, key) => (
            <Marker
              features={[feature]}
              lng={feature.geometry.coordinates[0]}
              lat={feature.geometry.coordinates[1]}
              key={key}
              isSelected={!!selectedFeatures.find((sf) => sf.id === feature.id)}
              onClick={() => {
                // setSelectedFeatures(features);
                // mapRef.current?.changeViewport({ center: { lat, lng } });
              }}
            />
          ))}
        </Filter> */}

      <react_mapbox_1.Layer ignoreClick filters={districtFilter.keepOnEmptyExpression} geojson={geojson_data_1.DISTRICTS_GEOJSON} styles={districts_1["default"]}/>

      <react_maps_1.Slot id="controls" position="bottom" className="p-4 pb-9 flex flex-col gap-2 w-screen pointer-events-none">
        <div className="flex justify-between items-end">
          <react_maps_1.ThemeController className={cx("pointer-events-auto", {
            "translate-x-96 delay-75": isSidebarVisible && !isMobile,
            "translate-x-0 delay-200": !(isSidebarVisible && !isMobile)
        })}/>
          <div ref={viewportControlsRef}>
            <react_maps_1.ViewportController className={cx({
            "-translate-x-96": shouldBeViewportControlsMoved,
            "translate-x-0": !shouldBeViewportControlsMoved
        })} slots={["legend", ["compass", "zoom"]]} desktopSlots={["legend", "geolocation", "compass", ["fullscreen", "zoom"]]} legend={legend} isLegendOpen={isLegendVisible} onLegendOpenChange={setLegendVisible}/>
          </div>
        </div>
        <div className="pointer-events-auto shadow-lg rounded-lg sm:hidden">
          <react_maps_1.SearchBar placeholder={t("search")} language={i18n.language} direction="top"/>
        </div>
      </react_maps_1.Slot>

      <react_maps_1.Layout isOnlyMobile>
        <react_maps_1.Slot id="mobile-header" position="top-right">
          <react_maps_ui_1.IconButton className="m-4" onClick={function () { return handleSideBar(!isSidebarVisible, true); }}>
            <react_maps_icons_1.Funnel size="md"/>
          </react_maps_ui_1.IconButton>
        </react_maps_1.Slot>

        <react_maps_1.Slot id="mobile-legend" isVisible={isLegendVisible} position="top-right">
          <react_maps_ui_1.Sidebar title={t("title")} isMobile isVisible={isLegendVisible} position="right" closeText={t("close")} onClose={function () { return setLegendVisible(false); }} onOpen={function () { return setLegendVisible(true); }}>
            <div className="p-6">{legend}</div>
          </react_maps_ui_1.Sidebar>
        </react_maps_1.Slot>
      </react_maps_1.Layout>

      <react_maps_1.Slot id="filters" isVisible={isSidebarVisible} position="top-left" autoPadding={!isMobile} avoidMapboxControls={!isMobile}>
        <Filters_1.Filters isVisible={isSidebarVisible} setVisible={function (isVisible) { return handleSideBar(isVisible !== null && isVisible !== void 0 ? isVisible : false, true); }} areFiltersDefault={areFiltersDefault} activeFilters={combinedFilter.active} onResetFiltersClick={handleResetFilters} purposeFilter={purposeFilter} districtFilter={districtFilter} occupancyFilter={occupancyFilter} isMobile={isMobile !== null && isMobile !== void 0 ? isMobile : false} minArea={minArea} maxArea={maxArea} minPrice={minPrice} maxPrice={maxPrice} onAreaChange={function (a) {
            setMinArea(a[0]);
            setMaxArea(a[1]);
        }} onAreaChangeEnd={function (a) {
            setMinAreaDebounced(a[0]);
            setMaxAreaDebounced(a[1]);
        }} onPriceChange={function (p) {
            setMinPrice(p[0]);
            setMaxPrice(p[1]);
        }} onPriceChangeEnd={function (p) {
            setMinPriceDebounced(p[0]);
            setMaxPriceDebounced(p[1]);
        }}/>
      </react_maps_1.Slot>

      <Detail_1["default"] ref={detailRef} avoidMapboxControls={shouldBeViewportControlsMoved} isMobile={isMobile !== null && isMobile !== void 0 ? isMobile : false} features={selectedFeatures !== null && selectedFeatures !== void 0 ? selectedFeatures : []} onClose={closeDetail}/>
    </react_maps_1.Map>);
};
exports.App = App;
exports["default"] = exports.App;
