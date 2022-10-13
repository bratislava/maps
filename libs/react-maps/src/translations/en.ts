export default {
  components: {
    Map: {
      errors: {
        generic: 'Error',
        notLocatedInBratislava: 'You are not located in Bratislava',
        noGeolocationSupport:
          'Your device or browser does not support geolocation',
      },
      tooltips: {
        scrollZoomBlockerCtrlMessage: 'Use ctrl + scroll to zoom the map',
        scrollZoomBlockerCmdMessage: 'Use ⌘ + scroll to zoom the map',
        touchPanBlockerMessage: 'Use two fingers to move the map',
      },
    },
    ThemeController: {
      satelliteMode: 'Aerial',
      darkLightMode: 'Light/Dark Base',
      aria: {
        enableSatelliteLayer: 'Enable aerial layer',
        disableSatelliteLayer: 'Disable aerial layer',
        setLightBase: 'Set light base',
        setDarkBase: 'Set dark base',
        openBaseOptions: 'Open base options',
        closeBaseOptions: 'Close base options',
      },
    },
    CompassButton: {
      resetBearing: 'Reset bearing to north',
    },
  },
};
