"use strict";
exports.__esModule = true;
exports.ThemeController = void 0;
var react_maps_icons_1 = require("@bratislava/react-maps-icons");
var react_maps_ui_1 = require("@bratislava/react-maps-ui");
var classnames_1 = require("classnames");
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var usehooks_ts_1 = require("usehooks-ts");
var Map_1 = require("../Map/Map");
var mapReducer_1 = require("../Map/mapReducer");
var i18n_1 = require("../../utils/i18n");
var ThemeControllerWithoutTranslations = function (_a) {
    var className = _a.className;
    var _b = (0, react_1.useContext)(Map_1.mapContext), mapState = _b.mapState, dispatchMapState = _b.dispatchMapState;
    var t = (0, react_i18next_1.useTranslation)('maps', {
        keyPrefix: 'components.ThemeController'
    }).t;
    var _c = (0, react_1.useState)(false), isOpen = _c[0], setOpen = _c[1];
    var handleDarkmodeChange = (0, react_1.useCallback)(function (isDarkmode) {
        dispatchMapState &&
            dispatchMapState({
                type: mapReducer_1.MapActionKind.SetDarkmode,
                value: isDarkmode
            });
        document.body.classList[isDarkmode ? 'add' : 'remove']('dark');
    }, [dispatchMapState]);
    var handleSatelliteChange = (0, react_1.useCallback)(function (isSatellite) {
        dispatchMapState &&
            dispatchMapState({
                type: mapReducer_1.MapActionKind.SetSatellite,
                value: isSatellite
            });
    }, [dispatchMapState]);
    var ref = (0, react_1.useRef)(null);
    var handleClickOutside = function () {
        setOpen(false);
    };
    (0, usehooks_ts_1.useOnClickOutside)(ref, handleClickOutside);
    return (<div className={(0, classnames_1["default"])('transform duration-500 ease-in-out flex gap-2 transition-transform', className)}>
      <div className={(0, classnames_1["default"])('flex flex-col h-auto text-font items-center justify-center pointer-events-auto shadow-lg bg-background-lightmode dark:bg-background-darkmode rounded-lg border-2 border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20 w-12', {
        // "transform active:scale-75 transition-all": !noAnimation,
        })}>
        <react_maps_ui_1.AnimateHeight isVisible={isOpen} className="flex flex-col">
          <react_maps_ui_1.Popover isSmall button={function (_a) {
            var isOpen = _a.isOpen, open = _a.open, close = _a.close;
            return (<button aria-label={isOpen
                    ? t('aria.disableSatelliteLayer')
                    : t('aria.enableSatelliteLayer')} onMouseEnter={open} onMouseLeave={close} onMouseDown={function () {
                    handleSatelliteChange(!(mapState === null || mapState === void 0 ? void 0 : mapState.isSatellite));
                    close();
                }} className="flex h-12 w-12 items-center justify-center">
                <react_maps_icons_1.Satellite size="xl"/>
              </button>);
        }} panel={<div>{t('satelliteMode')}</div>} allowedPlacements={['right']}/>
          <div className="bg-gray-lightmode dark:bg-gray-darkmode mx-auto h-[2px] w-8 opacity-20"/>
          <react_maps_ui_1.Popover isSmall button={function (_a) {
            var open = _a.open, close = _a.close;
            return (<button aria-label={(mapState === null || mapState === void 0 ? void 0 : mapState.isDarkmode)
                    ? t('aria.setLightBase')
                    : t('aria.setDarkBase')} onMouseEnter={open} onMouseLeave={close} onMouseDown={function () {
                    handleDarkmodeChange(!(mapState === null || mapState === void 0 ? void 0 : mapState.isDarkmode));
                    close();
                }} className="flex h-12 w-12 items-center justify-center">
                <react_maps_icons_1.Darkmode size="xl"/>
              </button>);
        }} panel={<div>{t('darkLightMode')}</div>}/>
        </react_maps_ui_1.AnimateHeight>
        <button aria-label={isOpen ? t('aria.closeBaseOptions') : t('aria.openBaseOptions')} ref={ref} onClick={function () { return setOpen(!isOpen); }} className="flex h-11 w-12 items-center justify-center">
          <react_maps_icons_1.Themes size="xl"/>
        </button>
      </div>
    </div>);
};
var ThemeController = function (props) {
    return (<react_i18next_1.I18nextProvider i18n={i18n_1["default"]}>
      <ThemeControllerWithoutTranslations {...props}/>
    </react_i18next_1.I18nextProvider>);
};
exports.ThemeController = ThemeController;
