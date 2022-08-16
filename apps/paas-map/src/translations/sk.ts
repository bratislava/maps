export default {
  title: "Mapa zón PAAS",
  search: "Hľadať",
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
    payment: { title: "Platba" },
    parking: { title: "Parkovanie" },
    support: { title: "Podpora" },
  },
  layers: {
    residents: {
      title: "Rezident",
      tooltip:
        "Ulice, na ktorých môžete na parkovanie využiť rezidentskú alebo abonentskú kartu pre danú zónu.",
      detail: {
        title: "Rezident",
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
      title: "Pobočky",
      detail: {
        title: "Pobočka",
        name: "Názov",
        address: "Adresa",
        openingHours: "Otváracie hodiny",
        place: "Miesto",
        additionalInformation: "Spresňujúce informácie",
      },
    },
    partners: {
      title: "Predajné miesta",
      detail: {
        title: "Predajné miesto",
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
          "p-plus-r": "P+R",
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
      title: "P+R",
    },
  },
};
