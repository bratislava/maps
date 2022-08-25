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
    payment: {
      title: "Payment",
      tooltip:
        "You can pay for parking via <1>mobile apps</1>, or you can use parking machines, affiliate partners or assistants - their location can be found on the map.",
      tooltipLink: "www.paas.sk/en/payment",
    },
    parking: { title: "Parking" },
    support: {
      title: "Support",
      tooltip:
        "If you need help with registration, you can contact us <1>online</1>, or by phone on <3>0800 200 222</3> or you can visit one of our customer centres.",
      tooltipLink: "mailto:registracie@paas.sk",
      tooltipPhone: "tel:0800200222",
    },
  },
  layers: {
    title: "Layers",
    residents: {
      title: "Resident",
      tooltip:
        "Streets on which you can use the resident or subscription card for the particular zone for parking.",
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
        "Zone visitors pay an hourly rate for parking on these streets at a specified time or they can use their bonus or visitor card.",
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
      title: "Parking machines",
      detail: {
        title: "Parking machine",
        location: "Location",
        parkomatId: "Parking machine ID",
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
      title: "Customer centres",
      detail: {
        title: "Customer centre",
        name: "Name",
        address: "Address",
        openingHours: "Opening hours",
        place: "Place",
        additionalInformation: "Additional informations",
      },
    },
    partners: {
      title: "Affiliate partners",
      detail: {
        title: "Affiliate partner",
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
      tooltip: "More about P+R parking lots.",
    },
  },
};
