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
exports.Map = exports.mapContext = void 0;
var geojson_data_1 = require("@bratislava/geojson-data");
var react_mapbox_1 = require("@bratislava/react-mapbox");
var react_maps_icons_1 = require("@bratislava/react-maps-icons");
var react_maps_ui_1 = require("@bratislava/react-maps-ui");
var bbox_1 = require("@turf/bbox");
var classnames_1 = require("classnames");
var mousetrap_1 = require("mousetrap");
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_resize_detector_1 = require("react-resize-detector");
require("../../styles/mapbox-corrections.css");
var i18n_1 = require("../../utils/i18n");
var constants_1 = require("@bratislava/react-mapbox/src/utils/constants");
var react_device_detect_1 = require("react-device-detect");
var districts_1 = require("../../utils/districts");
var Slot_1 = require("../Layout/Slot");
var SearchMarker_1 = require("../SearchMarker/SearchMarker");
var mapReducer_1 = require("./mapReducer");
exports.mapContext = (0, react_1.createContext)({
    mapboxAccessToken: '',
    mapState: null,
    dispatchMapState: null,
    containerRef: null,
    isMobile: false,
    methods: {
        changeViewport: function () { return void 0; },
        fitDistrict: function () { return void 0; },
        fitBounds: function () { return void 0; },
        fitFeature: function () { return void 0; },
        moveToFeatures: function () { return void 0; },
        turnOnGeolocation: function () { return void 0; },
        turnOffGeolocation: function () { return void 0; },
        toggleGeolocation: function () { return void 0; },
        addSearchMarker: function () { return void 0; },
        removeSearchMarker: function () { return void 0; },
        mountOrUpdateSlot: function () { return void 0; },
        unmountSlot: function () { return void 0; }
    }
});
var MapWithoutTranslations = (0, react_1.forwardRef)(function (_a, forwardedRef) {
    var _b, _c, _d;
    var mapboxAccessToken = _a.mapboxAccessToken, mapStyles = _a.mapStyles, children = _a.children, _e = _a.layerPrefix, layerPrefix = _e === void 0 ? 'BRATISLAVA' : _e, _f = _a.isDevelopment, isDevelopment = _f === void 0 ? false : _f, initialViewport = _a.initialViewport, selectedFeatures = _a.selectedFeatures, onMobileChange = _a.onMobileChange, onGeolocationChange = _a.onGeolocationChange, onMapClick = _a.onMapClick, onFeaturesClick = _a.onFeaturesClick, disablePitch = _a.disablePitch, disableBearing = _a.disableBearing, maxBounds = _a.maxBounds, maxZoom = _a.maxZoom, minZoom = _a.minZoom, _g = _a.cooperativeGestures, cooperativeGestures = _g === void 0 ? false : _g, interactive = _a.interactive, _h = _a.enableSatelliteOnLoad, enableSatelliteOnLoad = _h === void 0 ? false : _h, mapInformation = _a.mapInformation, mapInformationButtonClassName = _a.mapInformationButtonClassName, prevI18n = _a.prevI18n, onViewportChange = _a.onViewportChange, onViewportChangeDebounced = _a.onViewportChangeDebounced;
    var mapboxRef = (0, react_1.useRef)(null);
    var t = (0, react_i18next_1.useTranslation)('maps', {
        keyPrefix: 'components.Map'
    }).t;
    var _j = (0, react_1.useState)(false), isDevInfoVisible = _j[0], setDevInfoVisible = _j[1];
    var _k = (0, react_1.useState)(!!mapInformation.infoNotification), isInfoNotificationVisible = _k[0], setInfoNotificationVisible = _k[1];
    var _l = (0, react_1.useState)([]), slotStates = _l[0], setSlotStates = _l[1];
    var _m = (0, react_1.useReducer)(mapReducer_1.mapReducer, {
        isDarkmode: false,
        isSatellite: enableSatelliteOnLoad,
        isFullscreen: false,
        viewport: (0, react_mapbox_1.mergeViewports)(constants_1.defaultInitialViewport, initialViewport !== null && initialViewport !== void 0 ? initialViewport : {}),
        isGeolocation: false,
        geolocationMarkerLngLat: null,
        searchMarkerLngLat: null
    }), mapState = _m[0], dispatchMapState = _m[1];
    var _o = (0, react_1.useState)(null), isMobile = _o[0], setMobile = _o[1];
    var geolocationChangeHandler = (0, react_1.useCallback)(function (isGeolocation) {
        if (isGeolocation) {
            // if browser supports geolocation
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var _a;
                    var geolocationMarkerLngLat = {
                        lng: position.coords.longitude,
                        lat: position.coords.latitude
                    };
                    var isInBratislava = !!(0, districts_1.getFeatureDistrict)({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [
                                geolocationMarkerLngLat.lng,
                                geolocationMarkerLngLat.lat,
                            ]
                        },
                        properties: {}
                    });
                    if (!isInBratislava) {
                        alert(t('errors.notLocatedInBratislava'));
                        return;
                    }
                    (_a = mapboxRef.current) === null || _a === void 0 ? void 0 : _a.changeViewport({
                        center: geolocationMarkerLngLat,
                        zoom: 18
                    });
                    dispatchMapState({
                        type: mapReducer_1.MapActionKind.EnableGeolocation,
                        geolocationMarkerLngLat: geolocationMarkerLngLat
                    });
                }, function (error) {
                    alert("".concat(t('errors.generic'), ": ").concat(error.message));
                });
            }
            else {
                alert(t('errors.noGeolocationSupport'));
            }
        }
        else {
            dispatchMapState({
                type: mapReducer_1.MapActionKind.DisableGeolocation
            });
        }
    }, [t]);
    var _p = (0, react_1.useState)(false), isDisplayLandscapeModal = _p[0], setDisplayLandscapeModal = _p[1];
    var _q = (0, react_resize_detector_1.useResizeDetector)(), containerWidth = _q.width, containerHeight = _q.height, containerRef = _q.ref;
    var toggleDevInfo = (0, react_1.useCallback)(function () {
        setDevInfoVisible(function (isDevInfoVisible) { return !isDevInfoVisible; });
    }, [setDevInfoVisible]);
    // SHOWING DEVELOPMENT INFO
    (0, react_1.useEffect)(function () {
        if (isDevelopment) {
            var moustrapBind_1 = mousetrap_1["default"].bind(['ctrl+shift+d', 'command+shift+d'], function () {
                toggleDevInfo();
                return false;
            });
            return function () {
                moustrapBind_1.unbind(['ctrl+shift+d', 'command+shift+d']);
            };
        }
    }, [isDevelopment, toggleDevInfo]);
    var changeViewport = function (wantedViewport, duration) { var _a; return (_a = mapboxRef === null || mapboxRef === void 0 ? void 0 : mapboxRef.current) === null || _a === void 0 ? void 0 : _a.changeViewport(wantedViewport, duration); };
    var fitDistrict = function (district) {
        if (!mapboxRef.current)
            return;
        var MAP = mapboxRef.current;
        var districts = Array.isArray(district) ? district : [district];
        var districtFeatures = geojson_data_1.DISTRICTS_GEOJSON.features.filter(function (feature) {
            return districts.includes(feature.properties.name);
        });
        if (districtFeatures.length === 0)
            return;
        var boundingBox = (0, bbox_1["default"])({
            type: 'FeatureCollection',
            features: districtFeatures
        });
        MAP.fitBounds(boundingBox, { padding: 32 });
    };
    var fitBounds = function (bounds, options) {
        if (!mapboxRef.current)
            return;
        var MAP = mapboxRef.current;
        MAP.fitBounds(bounds, options);
    };
    var fitFeature = function (features, options) {
        var _a;
        if (!mapboxRef.current)
            return;
        var MAP = mapboxRef.current;
        var boundingBox = (0, bbox_1["default"])({
            type: 'FeatureCollection',
            features: Array.isArray(features) ? features : [features]
        });
        MAP.fitBounds(boundingBox, {
            padding: (_a = options === null || options === void 0 ? void 0 : options.padding) !== null && _a !== void 0 ? _a : 128,
            bearing: 0,
            pitch: 0,
            duration: 500
        });
    };
    var moveToFeatures = function (features, options) {
        if (!mapboxRef.current)
            return;
        var MAP = mapboxRef.current;
        var _a = (0, bbox_1["default"])({
            type: 'FeatureCollection',
            features: Array.isArray(features) ? features : [features]
        }), minX = _a[0], minY = _a[1], maxX = _a[2], maxY = _a[3];
        var lng = (minX + maxX) / 2;
        var lat = (minY + maxY) / 2;
        MAP.changeViewport({
            center: {
                lat: lat,
                lng: lng
            },
            zoom: options === null || options === void 0 ? void 0 : options.zoom
        });
    };
    var addSearchMarker = function (lngLat) {
        dispatchMapState({
            type: mapReducer_1.MapActionKind.AddSearchMarker,
            searchMarkerLngLat: lngLat
        });
    };
    var removeSearchMarker = function () {
        dispatchMapState({
            type: mapReducer_1.MapActionKind.RemoveSearchMarker
        });
    };
    var unmountSlot = (0, react_1.useCallback)(function (slotState) {
        setSlotStates(function (slotStates) {
            return slotStates.filter(function (s) { return s.id !== slotState.id; });
        });
    }, []);
    var mountOrUpdateSlot = (0, react_1.useCallback)(function (slotState) {
        setSlotStates(function (slotStates) {
            var foundSlotIndex = slotStates.findIndex(function (s) { return s.id === slotState.id; });
            var newSlotStates = [];
            if (foundSlotIndex >= 0) {
                newSlotStates = __spreadArray([], slotStates, true);
                newSlotStates[foundSlotIndex] = slotState;
            }
            else {
                newSlotStates = __spreadArray(__spreadArray([], slotStates, true), [slotState], false);
            }
            return newSlotStates;
        });
    }, []);
    var finalPadding = (0, react_1.useMemo)(function () {
        var top = Math.max.apply(Math, slotStates.map(function (slotState) { return slotState.padding.top; }));
        var right = Math.max.apply(Math, slotStates.map(function (slotState) { return slotState.padding.right; }));
        var bottom = Math.max.apply(Math, slotStates.map(function (slotState) { return slotState.padding.bottom; }));
        var left = Math.max.apply(Math, slotStates.map(function (slotState) { return slotState.padding.left; }));
        return { top: top, right: right, bottom: bottom, left: left };
    }, [slotStates]);
    var finalMapboxControlsPadding = (0, react_1.useMemo)(function () {
        var top = Math.max.apply(Math, slotStates
            .filter(function (slotState) { return slotState.avoidMapboxControls; })
            .map(function (slotState) { return slotState.padding.top; }));
        var right = Math.max.apply(Math, slotStates
            .filter(function (slotState) { return slotState.avoidMapboxControls; })
            .map(function (slotState) { return slotState.padding.right; }));
        var bottom = Math.max.apply(Math, slotStates
            .filter(function (slotState) { return slotState.avoidMapboxControls; })
            .map(function (slotState) { return slotState.padding.bottom; }));
        var left = Math.max.apply(Math, slotStates
            .filter(function (slotState) { return slotState.avoidMapboxControls; })
            .map(function (slotState) { return slotState.padding.left; }));
        return { top: top, right: right, bottom: bottom, left: left };
    }, [slotStates]);
    (0, react_1.useEffect)(function () {
        changeViewport({ padding: finalPadding });
    }, [finalPadding]);
    var mapMethods = (0, react_1.useMemo)(function () { return ({
        changeViewport: changeViewport,
        fitDistrict: fitDistrict,
        fitBounds: fitBounds,
        fitFeature: fitFeature,
        moveToFeatures: moveToFeatures,
        turnOnGeolocation: function () { return geolocationChangeHandler(true); },
        turnOffGeolocation: function () { return geolocationChangeHandler(false); },
        toggleGeolocation: function () {
            return geolocationChangeHandler(!mapState.isGeolocation);
        },
        addSearchMarker: addSearchMarker,
        removeSearchMarker: removeSearchMarker,
        mountOrUpdateSlot: mountOrUpdateSlot,
        unmountSlot: unmountSlot
    }); }, [
        geolocationChangeHandler,
        mapState.isGeolocation,
        mountOrUpdateSlot,
        unmountSlot,
    ]);
    // EXPOSING METHODS FOR PARENT COMPONENT
    (0, react_1.useImperativeHandle)(forwardedRef, function () { return mapMethods; }, [mapMethods]);
    var handleViewportChange = (0, react_1.useCallback)(function (viewport) {
        if (onViewportChange)
            onViewportChange(viewport);
        dispatchMapState({
            type: mapReducer_1.MapActionKind.ChangeViewport,
            viewport: viewport
        });
    }, [onViewportChange]);
    (0, react_1.useEffect)(function () {
        var _a;
        if (isMobile !== null && onMobileChange)
            onMobileChange(isMobile);
        (_a = mapboxRef.current) === null || _a === void 0 ? void 0 : _a.changeViewport({
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }, 0);
    }, [onMobileChange, isMobile]);
    (0, react_1.useEffect)(function () {
        onGeolocationChange && onGeolocationChange(mapState.isGeolocation);
    }, [onGeolocationChange, mapState.isGeolocation]);
    // CALCULATE MAP PADDING ON DETAIL AND FILTERS TOGGLING
    (0, react_1.useEffect)(function () {
        var mapboxLogoElement = document.querySelector('.mapboxgl-ctrl-bottom-left');
        var informationElement = document.querySelector('.mapboxgl-ctrl-bottom-right');
        if (!mapboxLogoElement || !informationElement)
            return;
        var mapboxLogoStyle = "\n        transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);\n        transform: translate(".concat(finalMapboxControlsPadding.left, "px, -").concat(finalMapboxControlsPadding.bottom, "px);\n        bottom: 8px; left: 8px;\n      ");
        var informationStyle = "\n        transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);\n        transform: translate(-".concat(finalMapboxControlsPadding.right, "px, -").concat(finalMapboxControlsPadding.bottom, "px);\n        bottom: 8px; right: 8px;\n      ");
        mapboxLogoElement.setAttribute('style', mapboxLogoStyle);
        informationElement.setAttribute('style', informationStyle);
    }, [
        finalMapboxControlsPadding.bottom,
        finalMapboxControlsPadding.left,
        finalMapboxControlsPadding.right,
        isMobile,
    ]);
    // SET MOBILE ACCORDING TO CONTAINER WIDTH
    (0, react_1.useEffect)(function () {
        setMobile((containerWidth !== null && containerWidth !== void 0 ? containerWidth : 0) < 640);
    }, [containerWidth]);
    var mapContextValue = (0, react_1.useMemo)(function () { return ({
        mapboxAccessToken: mapboxAccessToken,
        mapState: mapState,
        dispatchMapState: dispatchMapState,
        isMobile: isMobile,
        containerRef: containerRef,
        methods: mapMethods
    }); }, [mapboxAccessToken, mapState, isMobile, containerRef, mapMethods]);
    // DISPLAY/HIDE WARNING MODAL TO ROTATE DEVICE TO PORTRAIT MODE
    (0, react_1.useEffect)(function () {
        if (react_device_detect_1.isMobile &&
            (containerWidth !== null && containerWidth !== void 0 ? containerWidth : 0) < 900 &&
            (containerWidth !== null && containerWidth !== void 0 ? containerWidth : 0) > (containerHeight !== null && containerHeight !== void 0 ? containerHeight : 0)) {
            setDisplayLandscapeModal(true);
        }
        else {
            setDisplayLandscapeModal(false);
        }
    }, [isMobile, containerWidth, containerHeight]);
    var mapboxLocale = (0, react_1.useMemo)(function () { return ({
        'ScrollZoomBlocker.CtrlMessage': t('tooltips.scrollZoomBlockerCtrlMessage'),
        'ScrollZoomBlocker.CmdMessage': t('tooltips.scrollZoomBlockerCmdMessage'),
        'TouchPanBlocker.Message': t('tooltips.touchPanBlockerMessage')
    }); }, [t]);
    var _r = (0, react_1.useState)(false), isInformationModalOpen = _r[0], setInformationModalOpen = _r[1];
    return (<react_i18next_1.I18nextProvider i18n={prevI18n}>
        <div className={(0, classnames_1["default"])('h-full w-full relative text-foreground-lightmode')}>
          <exports.mapContext.Provider value={mapContextValue}>
            <div ref={containerRef} className="text-font dark:text-foreground-darkmode relative z-10 h-full w-full">
              <react_mapbox_1.Mapbox interactive={interactive} initialViewport={initialViewport} ref={mapboxRef} isDarkmode={mapState.isDarkmode} isSatellite={mapState.isSatellite} layerPrefix={layerPrefix} mapStyles={mapStyles} mapboxAccessToken={mapboxAccessToken} onFeaturesClick={onFeaturesClick} selectedFeatures={selectedFeatures} onClick={onMapClick} onViewportChange={handleViewportChange} onViewportChangeDebounced={onViewportChangeDebounced} isDevelopment={isDevelopment && isDevInfoVisible} disablePitch={disablePitch} disableBearing={disableBearing} maxBounds={maxBounds} cooperativeGestures={cooperativeGestures} locale={mapboxLocale} maxZoom={maxZoom} minZoom={minZoom}>
                {/* information button */}
                <Slot_1.Slot id="information-button">
                  <react_maps_ui_1.IconButton onClick={function () { return setInformationModalOpen(true); }} className={(0, classnames_1["default"])('fixed left-4 top-4 w-8 h-8 sm:top-6 sm:left-auto sm:right-6 !rounded-full', mapInformationButtonClassName)}>
                    <react_maps_icons_1.InformationAlt size="sm"/>
                  </react_maps_ui_1.IconButton>
                </Slot_1.Slot>

                {isInfoNotificationVisible &&
            <Slot_1.Slot id="infoNotification" position="top-right" className='z-50'>
                    <div className={(0, classnames_1["default"])('bg-background-lightmode dark:bg-background-darkmode max-w-[480px] rounded-[8px] p-[20px] shadow-lg', !isMobile ? 'mx-[20px] mt-[20px]' : 'mx-[12px] mt-[12px]')}>
                      <div className='grid gap-2'>
                        <div className="flex gap-2">
                          {!isMobile && <react_maps_icons_1.Information className="mt-[2px]" size="md"/>}
                          <h5 className="text-md grow font-semibold">{(_b = mapInformation.infoNotification) === null || _b === void 0 ? void 0 : _b.title}</h5>
                          <div className='cursor-pointer pt-[2px]' onClick={function () { return setInfoNotificationVisible(false); }}>
                            <react_maps_icons_1.X size="sm"/>
                          </div>
                        </div>
                      </div>

                      <div className={(0, classnames_1["default"])('mt-[12px]', !isMobile ? 'ml-[30px]' : '')}>
                        <p style={{
                    display: '-webkit-box',
                    maxWidth: '450px',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                          {(_c = mapInformation.infoNotification) === null || _c === void 0 ? void 0 : _c.txt}
                        </p>
                      </div>

                      <div className={(0, classnames_1["default"])('mt-[12px]', !isMobile ? 'ml-[30px]' : '')}>
                        <p onClick={function () {
                    setInfoNotificationVisible(false);
                    setInformationModalOpen(true);
                }} className="cursor-pointer font-semibold underline">
                          {(_d = mapInformation.infoNotification) === null || _d === void 0 ? void 0 : _d.moreTxt}
                        </p>
                      </div>
                    </div>
                  </Slot_1.Slot>}


                <>{children}</>

                {/* geolocation marker */}
                {mapState.isGeolocation && mapState.geolocationMarkerLngLat && (<react_mapbox_1.Marker feature={{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        mapState.geolocationMarkerLngLat.lng,
                        mapState.geolocationMarkerLngLat.lat,
                    ]
                },
                properties: {}
            }}>
                    <div className="relative flex items-center justify-center">
                      <div className="flex items-center justify-center opacity-20">
                        <div className="bg-gray-lightmode dark:bg-gray-darkmode absolute h-20 w-20 animate-ping rounded-full"/>
                      </div>
                      <div className="absolute h-4 w-4 rounded-full border-4 border-black bg-white dark:border-white dark:bg-black"/>
                    </div>
                  </react_mapbox_1.Marker>)}

                {/* search marker */}
                {mapState.searchMarkerLngLat && (<SearchMarker_1.SearchMarker {...mapState.searchMarkerLngLat}/>)}
              </react_mapbox_1.Mapbox>
            </div>
          </exports.mapContext.Provider>

          <react_maps_ui_1.Modal overlayClassName="max-w-xs !p-0" isOpen={isDisplayLandscapeModal} hideCloseButtonIcon={true}>
            <div className="gap-6 p-6">
              <div className="grid">
                <div className="flex">
                  <div className="grow">
                  </div>
                  <div className="mb-3 grow-0">
                    <react_maps_icons_1.InformationAlt className="rounded-full border-[16px] border-solid border-[#EBEBEB] bg-[#333333] !text-[#ffffff]" size="default"/>
                  </div>
                  <div className="relative grow cursor-pointer" onClick={function () { return setDisplayLandscapeModal(false); }}>
                    <react_maps_icons_1.X size="sm" className='absolute top-0 right-0 float-right grow'/>
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-center">
                <div>
                  V niektorých prípadoch sa mapa nemusí zobraziť správne. Na mobilnom zariadení je mapu najlepšie používať na výšku.
                </div>
                <div onClick={function () { return setDisplayLandscapeModal(false); }} className="mt-[24px] cursor-pointer font-semibold">
                  Zrušiť
                </div>
              </div>
            </div>

          </react_maps_ui_1.Modal>

          <react_maps_ui_1.Modal overlayClassName="max-w-xl !p-0" hideCloseButtonIcon={true} isOpen={isInformationModalOpen} closeButtonInCorner onClose={function () { return setInformationModalOpen(false); }}>
            <div className="flex flex-col gap-6 pt-6">
              <div className="mr-6 flex gap-2">
                <div className="text-md grow px-6 font-medium">
                  {mapInformation.title}
                </div>
                <div className='cursor-pointer pt-[2px]' onClick={function () { return setInformationModalOpen(false); }}>
                  <react_maps_icons_1.X size="sm"/>
                </div>
              </div>

              {mapInformation.infoNotification &&
            <>
                  <div className="px-6 font-medium">
                    {mapInformation.infoNotification.title}
                  </div>
                  <div className="px-6">
                    {mapInformation.infoNotification.txt}
                  </div>
                  <react_maps_ui_1.Divider className="mx-6"/>
                </>}
              <div className="px-6">{mapInformation.description}</div>

              {(mapInformation === null || mapInformation === void 0 ? void 0 : mapInformation.privatePartners) && (mapInformation === null || mapInformation === void 0 ? void 0 : mapInformation.privatePartners.length) > 0 &&
            <div>
                  <div className="pl-6 font-medium">Partneri:</div>
                  <div className="flex flex-wrap gap-4 px-6 py-2">
                    {mapInformation.privatePartners.map(function (partner, index) {
                    var _a, _b;
                    return (<a key={index} target="_blank" href={partner.link} className="block" rel="noreferrer">
                        <img className="object-contain" style={{
                            height: (_a = partner.height) !== null && _a !== void 0 ? _a : 36,
                            width: (_b = partner.width) !== null && _b !== void 0 ? _b : 'auto'
                        }} src={partner.image} alt={partner.name}/>
                      </a>);
                })}
                  </div>
                  <react_maps_ui_1.Divider className="mx-6"/>
                </div>}
              <div className="flex flex-wrap items-center justify-center gap-4 px-6 py-2">
                {mapInformation.partners.map(function (partner, index) {
            var _a, _b;
            return (<a key={index} target="_blank" href={partner.link} className="block" rel="noreferrer">
                    <img className="object-contain" style={{
                    height: (_a = partner.height) !== null && _a !== void 0 ? _a : 36,
                    width: (_b = partner.width) !== null && _b !== void 0 ? _b : 'auto'
                }} src={partner.image} alt={partner.name}/>
                  </a>);
        })}
              </div>
              <div className="bg-gray-lightmode/5 dark:bg-gray-darkmode/10 flex items-center gap-5 px-6 py-4">
                <react_maps_icons_1.Feedback size="xl"/>
                <div className="text-[14px]">{mapInformation.footer}</div>
              </div>
            </div>
          </react_maps_ui_1.Modal>
        </div>
      </react_i18next_1.I18nextProvider>);
});
MapWithoutTranslations.displayName = 'MapWithoutTranslations';
exports.Map = (0, react_1.forwardRef)(function (props, forwardedRef) {
    var prevI18n = (0, react_i18next_1.useTranslation)().i18n;
    return (<react_i18next_1.I18nextProvider i18n={i18n_1["default"]}>
        <MapWithoutTranslations {...props} ref={forwardedRef} prevI18n={prevI18n}/>
      </react_i18next_1.I18nextProvider>);
});
exports.Map.displayName = 'Map';
