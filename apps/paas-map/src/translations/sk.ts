export default {
  title: "Mapa zón PAAS",
  search: "Hľadať",
  close: "Zavrieť",
  layersHint: "Pre viac informácií kliknite na zvýraznené ulice.",
  filters: {
    title: "Filter",
    reset: "Zrušiť",
    zone: {
      placeholder: "Zóna",
      multipleZones: "Vybraných",
    },
  },
  layerGroups: {
    payment: {
      title: "Platba",
      tooltip:
        "Hodinové parkovné môžete uhradiť <1>cez mobilné aplikácie</1>, alebo prostredníctvom parkomatu, partnerskej prevádzke alebo u asistentov v uliciach.",
      tooltipLink: "http://paas.sk/platba",
    },
    parking: { title: "Parkovanie" },
    support: {
      title: "Podpora",
      tooltip:
        "Ak potrebujete pomôcť s registráciou a nákupom parkovacích kariet, kontaktovať náš môžete <1>online</1>, na infolinke <3>0800 200 222</3> alebo osobne na jednom z klientskych miest.",
      tooltipLink: "https://paas.sk/formular/",
      tooltipPhone: "tel:0800200222",
    },
  },
  layers: {
    title: "Vrstvy",
    residents: {
      title: "Rezident",
      tooltip:
        "Ulice, na ktorých môžete na parkovanie využiť rezidentskú alebo abonentskú kartu pre danú zónu.",
      detail: {
        title: "Rezident",
        planned: "Tento úsek je plánovaný",
        cardValidity: "Platnosť rezidentskej/abonentskej karty",
        cards: "Karty",
        cardsUrl: "https://paas.sk/som-rezident/",
      },
    },
    visitors: {
      title: "Návštevník",
      tooltip:
        "Ulice, na ktorých návštevníci zóny platia za parkovanie v stanovenom čase hodinovú sadzbu, respektíve môžu využiť na parkovanie bonusovú alebo návštevnícku kartu.",
      detail: {
        title: "Návštevník",
        planned: "Tento úsek je plánovaný",
        location: "Lokalita",
        parkingSectionCode: "Kód úseku parkovania",
        price: "Cena (€/h)",
        chargingTime: "Čas spoplatnenia (h)",
        payment: "Platba",
        paymentUrl: "https://paas.sk/platba/",
      },
    },
    parkomats: {
      title: "Parkomaty",
      detail: {
        title: "Parkomat",
        location: "Lokalita",
        parkomatId: "ID parkovacieho automatu",
      },
    },
    assistants: {
      title: "Asistenti",
      detail: {
        title: "Asistent",
        residentZone: "Rezidentská zóna",
      },
    },
    branches: {
      title: "Klientske miesta",
      detail: {
        title: "Klientske miesto",
        name: "Názov",
        address: "Adresa",
        openingHours: "Otváracie hodiny",
        place: "Miesto",
        additionalInformation: "Spresňujúce informácie",
      },
    },
    partners: {
      title: "Partnerské prevádzky",
      detail: {
        title: "Partnerská prevádzka",
        name: "Názov",
        address: "Adresa",
        openingHours: "Otváracie hodiny",
        navigate: "Navigovať",
      },
    },
    "parking-lots": {
      title: "Parkoviská",
      detail: {
        title: {
          garage: "Garáž",
          "parking-lot": "Parkovisko",
          "p-plus-r": "P+R záchytné parkovisko",
        },
        name: "Názov",
        address: "Adresa",
        count: "Počet parkovacích miest",
        mhd: "MHD",
        mhdDistance: "Vzdialenosť MHD",
        toCentre: "Dojazdová doba do centra",
        navigate: "Navigovať",
      },
    },
    garages: {
      title: "Garáže",
    },
    "p-plus-r": {
      title: "P+R záchytné parkoviská",
      tooltip: "Viac informácií o P+R záchytných parkoviskách.",
    },
  },
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
    description: "Mapa parkovacieho asistenta PAAS.",
    footer: "Zanechajte nám spätnú väzbu na <1>mapy.inovacie@bratislava.sk</1>",
    footerLink: "mailto:mapy.inovacie@bratislava.sk",
  },
};
