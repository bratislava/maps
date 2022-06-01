export default {
  title: 'Mapa zón',
  search: 'Hľadať',
  layersHint: 'Pre viac informácií kliknite na zvýraznené ulice.',
  ruzinovRegulation: 'Starý Ružinov - východ, regulácia od 23.3.2022',
  paymentOptions: 'Možnosti platby',
  paymentOptionsUrl: 'https://paas.sk/platba/',
  layers: {
    residentsLayer: {
      title: 'Rezident',
      description:
        'Ulice, na ktorých môžete na parkovanie využiť rezidentskú alebo abonentskú kartu pre danú zónu.',
      detail: {
        title: 'Rezident',
        cardValidity: 'Platnosť rezidentskej/abonentskej karty',
      },
    },
    visitorsLayer: {
      title: 'Návštevník',
      description:
        'Ulice, na ktorých návštevníci zóny platia za parkovanie v stanovenom čase hodinovú sadzbu, respektíve môžu využiť na parkovanie bonusovú alebo návštevnícku kartu.',
      detail: {
        title: 'Návštevník',
        location: 'Lokalita',
        district: 'Mestská časť',
        zone: 'Zóna',
        code: 'Kód úseku parkovania',
        price: 'Cena (€/h)',
        regulationTime: 'Čas regulácie (h)',
        chargingTime: 'Čas spoplatnenia (h)',
      },
    },
    parkomatsLayer: {
      title: 'Parkovacie automaty',
      detail: {
        title: 'Parkovací automat',
        location: 'Lokalita',
        id: 'ID parkovacieho automatu',
      },
    },
    assistantsLayer: {
      title: 'Parkovací asistenti',
      detail: {
        title: 'Parkovací asistent',
        residentZone: 'Rezidentská zóna',
      },
    },
    branchesLayer: {
      title: 'Pobočky',
      detail: {
        title: 'Pobočka',
        name: 'Názov',
        address: 'Adresa',
        openingHours: 'Otváracie hodiny',
        place: 'Miesto',
        additionalInformation: 'Spresňujúce informácie',
      },
    },
    partnersLayer: {
      title: 'Predajné miesta',
      detail: {
        title: 'Predajné miesto',
        name: 'Názov',
        address: 'Adresa',
      },
    },
  },
};
