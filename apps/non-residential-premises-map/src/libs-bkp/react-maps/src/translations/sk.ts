export default {
  components: {
    Map: {
      errors: {
        generic: 'Chyba',
        notLocatedInBratislava: 'Nenachádzate sa v Bratislave',
        noGeolocationSupport:
          'Vaše zariadenie alebo prehliadač nepodporuje geolokáciu',
      },
      tooltips: {
        scrollZoomBlockerCtrlMessage:
          'Použite ctrl + koliesko myši pre priblíženie',
        scrollZoomBlockerCmdMessage:
          'Použite ⌘ + koliesko myši pre priblíženie',
        touchPanBlockerMessage: 'Použite dva prsty pre pohyb na mape',
      },
    },
    ThemeController: {
      satelliteMode: 'Letecký podklad',
      darkLightMode: 'Svetlý/Tmavý podklad',
      aria: {
        enableSatelliteLayer: 'Zobraziť letecký podklad',
        disableSatelliteLayer: 'Schovať letecký podklad',
        setLightBase: 'Nastaviť svetlý režim',
        setDarkBase: 'Nastaviť tmavý režim',
        openBaseOptions: 'Otvoriť nastavenia podkladu',
        closeBaseOptions: 'Zavrieť nastavenia podkladu',
      },
    },
    CompassButton: {
      resetBearing: 'Resetovať natočenie mapy na sever',
    },
  },
};
