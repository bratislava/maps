export default {
  title: "Mapa zón PAAS",
  search: "Hľadať",
  layersHint: "Pre viac informácií kliknite na zvýraznené ulice.",
  ruzinovRegulation: "Starý Ružinov - východ, regulácia od 23.3.2022",
  paymentOptions: "Možnosti platby",
  paymentOptionsUrl: "https://paas.sk/platba/",
  filters: {
    title: "Filter",
    reset: "Zrušiť",
  },
  layerGroups: {
    payment: { title: "Platba" },
    parking: { title: "Parkovanie" },
    support: { title: "Podpora" },
  },
  layers: {
    residents: {
      title: "Rezident",
      description:
        "Ulice, na ktorých môžete na parkovanie využiť rezidentskú alebo abonentskú kartu pre danú zónu.",
      detail: {
        title: "Rezident",
        cardValidity: "Platnosť rezidentskej/abonentskej karty",
      },
    },
    visitors: {
      title: "Návštevník",
      description:
        "Ulice, na ktorých návštevníci zóny platia za parkovanie v stanovenom čase hodinovú sadzbu, respektíve môžu využiť na parkovanie bonusovú alebo návštevnícku kartu.",
      detail: {
        title: "Návštevník",
        location: "Lokalita",
        district: "Mestská časť",
        zone: "Zóna",
        code: "Kód úseku parkovania",
        price: "Cena (€/h)",
        regulationTime: "Čas regulácie (h)",
        chargingTime: "Čas spoplatnenia (h)",
        NPKInfo: "Informácia NPK",
        RPKInfo: "Informácia RPK",
      },
    },
    parkomats: {
      title: "Parkovacie automaty",
      detail: {
        title: "Parkovací automat",
        location: "Lokalita",
        id: "ID parkovacieho automatu",
      },
    },
    assistants: {
      title: "Parkovací asistenti",
      detail: {
        title: "Parkovací asistent",
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
      },
    },
    garages: {
      title: "Garáže",
      detail: {
        title: "Garáž",
        name: "Názov",
        address: "Adresa",
        NPKInfo: "Informácia NPK",
      },
    },
    "p-plus-r": {
      title: "P+R",
      detail: {
        title: "P+R",
        name: "Názov",
        count: "Počet parkovacích miest",
        mhd: "MHD",
        mhdDistance: "Vzdialenosť MHD",
        toCentre: "Dojazdová doba do centra",
      },
    },
    "p-plus-r-region": {
      title: "P+R Región",
      detail: {
        title: "P+R Región",
        name: "Názov",
        type: "Typ",
        count: "Počet parkovacích miest",
        area: "Spádová oblasť",
        mhd: "Verejná doprava",
      },
    },
  },
};
