export default {
  title: "Zone map PAAS",
  search: "Search",
  close: "Close",
  layersHint: "Click on the highlighted streets for more information.",
  filters: {
    title: "Filter",
    reset: "Reset",
    zone: {
      placeholder: "Zone",
      multipleZones: "Selected",
      types: {
        SM1: "Staré mesto - SM1",
        NM1: "Nové mesto - NM1",
        RU1: "Ružinov - RU1",
        PE1: "Petržalka Dvory 4 - PE1",
      },
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
        additionalInfo:
          "The bonus card cannot be used on the busiest sections (sections charged at the rate of 2 euros/h, especially in the city center). <1>More information about the bonus card</1>",
        additionalInfoUrl: "https://paas.sk/en/i-am-not-a-resident/",
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
          "p-plus-r": "P+R parking lot",
        },
        name: "Name",
        address: "Address",
        count: "Number of parking spots",
        mhd: "Public transport",
        mhdDistance: "Distance to public transport",
        toCentre: "Time to centre",
        navigate: "Navigate",
        operatingTime: "Operating time",
      },
    },
    garages: {
      title: "Garages",
    },
    "p-plus-r": {
      title: "P+R parking lots",
      tooltip: "More about P+R parking lots.",
    },
  },
  activeFilters: "Active filters",
  resetFilters: "Reset filters",
  informationModal: {
    title: "Map information",
    description: "Map of parking assistant PAAS.",
    footer: "Leave the feedback at <1>mapy.inovacie@bratislava.sk</1>",
    footerLink: "mailto:mapy.inovacie@bratislava.sk",
  },
};
