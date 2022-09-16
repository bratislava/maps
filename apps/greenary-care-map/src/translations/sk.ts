export default {
  title: "Starostlivosť o dreviny",
  tabTitle: "Mapa starostlivosti o dreviny",
  search: "Hľadať",
  close: "Zavrieť",
  loading: "Načítavanie",
  layersLabel: "Vrstvy",
  filters: {
    title: "Filter",
    active: "Aktívny filter",
    reset: "Zrušiť",
    year: {
      title: "Rok",
      placeholder: "Rok",
      multipleYears: "Zvolených",
    },
    district: {
      title: "Mestská časť",
      placeholder: "Mestská časť",
      multipleDistricts: "Zvolených",
    },
    season: {
      title: "Obdobie",
      seasons: {
        spring: "jar",
        summer: "leto",
        autumn: "jeseň",
        winter: "zima",
      },
    },
  },
  layers: {
    esri: {
      detail: {
        title: "Detail",
        slovakName: "Slovenský názov",
        latinName: "Latinský názov",
        street: "Ulica",
        operation: "Výkon",
        description: "Popis výkonu",
        date: "Dátum realizácie",
        district: "Mestská časť",
        document: "Rozhodutie / posudok",
        showDocument: "Zobraziť dokument",
        noDocuments: "Žiadne dokumenty",
      },
    },
  },
  categories: {
    felling: "Výrub",
    fellingByPermit: "Výrub z rozhodnutia",
    emergencyFelling: "Výrub havaríjny",
    invasivePlantsFelling: "Výrub inváznej dreviny",
    trimming: "Orez",
    invasivePlants: "Invázne dreviny",
    injectionOfInvasivePlants: "Injektáž inváznej dreviny",
    others: "Ostatné",
    stumpRemoval: "Frézovanie pňa",
    dendrologicalAssessment: "Dendrologický posudok",
    fallenTreeRemoval: "Odstránenie padnutého stromu",
    mistletoeManagement: "Manažment imela",
  },
  districtBorder: "Hranica mestskej časti",
  // for libraries
  activeFilters: "Aktívny filter",
  resetFilters: "Zrušiť filter",
  errors: {
    generic: "Chyba",
    notLocatedInBratislava: "Nenachádzate sa v Bratislave",
    noGeolocationSupport: "Vaše zariadenie alebo prehliadač nepodporuje geolokáciu",
  },
  tooltips: {
    darkLightMode: "Svetlý/Tmavý podklad",
    satelliteMode: "Letecký podklad",
    scrollZoomBlockerCtrlMessage: "Použite ctrl + koliesko myši pre priblíženie",
    scrollZoomBlockerCmdMessage: "Použite ⌘ + koliesko myši pre priblíženie",
    touchPanBlockerMessage: "Použite dva prsty pre pohyb na mape",
  },
  informationModal: {
    title: "Informácie o mape",
    description:
      "Mapa starostlivosti o dreviny v správe Magistrátu mesta Bratislava. Viac informácií o starostlivosti o dreviny nájdete na stránkach <1>údržby a tvorby zelene</1>, za ktorú je zodpovedné Oddelenie tvorby mestskej zelene.",
    descriptionLink:
      "https://bratislava.sk/zivotne-prostredie-a-vystavba/zelen/udrzba-a-tvorba-zelene",
    footer: "Zanechajte nám spätnú väzbu na <1>mapy.inovacie@bratislava.sk</1>",
    footerLink: "mailto:mapy.inovacie@bratislava.sk",
  },
};
