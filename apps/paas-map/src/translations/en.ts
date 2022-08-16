export default {
  title: "Zone map PAAS",
  search: "Search",
  layersHint: "Click on the highlighted streets for more information.",
  filters: {
    title: "Filter",
    reset: "Reset",
    zone: {
      placeholder: "Zone",
      multipleZones: "Selected",
    },
  },
  layerGroups: {
    payment: { title: "Payment" },
    parking: { title: "Parking" },
    support: { title: "Support" },
  },
  layers: {
    residents: {
      title: "Resident",
      tooltip:
        "Ulice, na ktorých môžete na parkovanie využiť rezidentskú alebo abonentskú kartu pre danú zónu.",
      detail: {
        title: "Resident",
        planned: "This section is planned",
        cardValidity: "Validity of resident/abonent cards",
        cards: "Cards",
        cardsUrl: "https://paas.sk/en/i-am-a-resident/",
      },
    },
    visitors: {
      title: "Visitor",
      tooltip:
        "Ulice, na ktorých návštevníci zóny platia za parkovanie v stanovenom čase hodinovú sadzbu, respektíve môžu využiť na parkovanie bonusovú alebo návštevnícku kartu.",
      detail: {
        title: "Visitor",
        planned: "This section is planned",
        location: "Location",
        parkingSectionCode: "Parking section code",
        price: "price (€/h)",
        chargingTime: "Charging time (h)",
        payment: "Payment",
        paymentUrl: "https://paas.sk/en/payment/",
      },
    },
    parkomats: {
      title: "Parkomats",
      detail: {
        title: "Parkomat",
        location: "Location",
        parkomatId: "Parkomat ID",
      },
    },
    assistants: {
      title: "Assistants",
      detail: {
        title: "Assistant",
        residentZone: "Residential zone",
      },
    },
    branches: {
      title: "Branches",
      detail: {
        title: "Branch",
        name: "Name",
        address: "Address",
        openingHours: "Opening hours",
        place: "Place",
        additionalInformation: "Additional informations",
      },
    },
    partners: {
      title: "Partners",
      detail: {
        title: "Partner",
        name: "Name",
        address: "Address",
        openingHours: "Opening hours",
        navigate: "Navigate",
      },
    },
    "parking-lots": {
      title: "Parking lots",
      detail: {
        title: {
          garage: "garage",
          "parking-lot": "Parking lot",
          "p-plus-r": "P+R",
        },
        name: "Name",
        address: "Address",
        count: "Number of parking spots",
        mhd: "Public transport",
        mhdDistance: "Distance to public transport",
        toCentre: "Time to centre",
        navigate: "Navigate",
      },
    },
    garages: {
      title: "Garages",
    },
    "p-plus-r": {
      title: "P+R",
    },
  },
};
